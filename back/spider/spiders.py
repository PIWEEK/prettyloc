# -*- coding: utf-8 -*-
import logging
import time

import scrapy
from django.contrib.gis.geos import Point

from api.models import Route
from spider.scrapwikiloc import generate_line, activities_es, activities_en


class RoutesSpider(scrapy.Spider):
    name = "routes"
    old_urls = []

    # custom_settings = {
    #     'DOWNLOADER_MIDDLEWARES': {
    #         'spider.middlewares.RandomUserAgentMiddleware': 400,
    #         'spider.middlewares.ProxyMiddleware': 410,
    #         'scrapy.contrib.downloadermiddleware.useragent.UserAgentMiddleware': None,
    #         # Disable compression middleware, so the actual HTML pages are cached
    #     }
    # }

    def start_requests(self):
        url = getattr(self, 'url', None)
        if url is not None:
            yield scrapy.Request(url, self.parse)
        else:
            logging.error("Wikiloc search route url is mandatory")

    def parse(self, response):
        self.old_urls.append(response.url)
        urls = response.xpath("//a/@href").extract()
        route_urls = [url for url in urls if 'https://es.wikiloc.com/wikiloc/view.do?id=' in url]

        for route_urls in route_urls:
            if route_urls not in self.old_urls:
                index = route_urls.find("id=")
                route_id = int(route_urls[index + 3:])
                route = Route.objects.filter(external_id=route_id).first()
                if route is None:
                    time.sleep(1)
                    yield scrapy.Request(response.urljoin(route_urls),
                                         callback=self.parse_route)

        next_route = [url for url in urls if 'https://es.wikiloc.com/wikiloc/find.do' in url][-1]

        if next_route not in self.old_urls:
            time.sleep(5)
            yield scrapy.Request(next_route, self.parse)

    def parse_route(self, response):
        url = response.url
        self.old_urls.append(url)

        index = url.find("id=")
        route_id = int(url[index + 3:])

        title = response.css("h1::text").extract_first()[1:-1]
        trail_data = response.xpath("//div[@id='trail-data']")

        # '12,56\xa0km'
        route_length_txt = trail_data.xpath(
            "//span[@class='trail-data-icon glyphicon icon-length']/following-sibling::span/text()").extract_first()
        route_length = float(route_length_txt[:-3].replace(',', '.'))

        # 'Sí'
        route_loop_txt = trail_data.xpath(
            "//span[@class='trail-data-icon glyphicon icon-loop']/following-sibling::span/text()").extract_first()
        route_loop = route_loop_txt == 'Sí'

        # '446\xa0m'
        route_uphill_txt = trail_data.xpath(
            "//span[@class='trail-data-icon glyphicon icon-uphill']/following-sibling::span/text()").extract_first()
        route_uphill = float(route_uphill_txt[:-2].replace(',', '.'))

        # '446\xa0m'
        route_downhill_txt = trail_data.xpath(
            "//span[@class='trail-data-icon glyphicon icon-downhill']/following-sibling::span/text()").extract_first()
        route_downhill = float(route_downhill_txt[:-2].replace(',', '.'))

        # '1.814\xa0m'
        route_height_txt = trail_data.xpath(
            "//span[@class='trail-data-icon glyphicon icon-height']/following-sibling::span/text()").extract_first()
        route_height = float(route_height_txt[:-2].replace('', ''))

        # '1.506\xa0m'
        route_low_txt = trail_data.xpath(
            "//span[@class='trail-data-icon glyphicon icon-height']/following-sibling::span/text()").extract_first()
        route_low = float(route_low_txt[:-2].replace('', ''))

        # https://es.wikiloc.com/rutas/mountain-bike"
        route_type_es = response.xpath("//a[@id='activity-badge']/@href").extract_first()[29:]
        route_type = activities_en[activities_es.index(route_type_es)]

        # Extract latitude and longitude
        txt = response.xpath('//body').extract_first()
        index = txt.find("new google.maps.LatLng")
        txt = txt[index + 23:]
        index = txt.find(',')
        lat = float(txt[:index])
        txt = txt[index + 1:]
        index = txt.find(')')
        lon = float(txt[:index])

        # Data for geojson
        txt = response.xpath('//body').extract_first()
        index = txt.find("var trinfo")
        txt = txt[index + 13:]
        index = txt.find("[")
        txt = txt[index:]
        index = txt.find("]")
        gpx_lat = eval(txt[:index + 1])
        txt = txt[index:]
        index = txt.find("[")
        txt = txt[index:]
        index = txt.find("]")
        gpx_lon = eval(txt[:index + 1])

        # Extra data (optional)
        technical_difficulty = None
        time = None
        coordinates = None
        upload_date = None
        recorded_date = None
        stars = None

        extra_data = response.xpath("//h4")
        for data in extra_data:
            if 'Dificultad técnica' in data.xpath("text()").extract_first():
                technical_difficulty_es = data.xpath("span/text()")[1].extract()
                if technical_difficulty_es == '\n\xa0Fácil':
                    technical_difficulty = 1
                elif technical_difficulty_es == '\n\xa0Moderado':
                    technical_difficulty = 2
                elif technical_difficulty_es == '\n\xa0Difícil':
                    technical_difficulty = 3
                elif technical_difficulty_es == '\n\xa0Muy difícil':
                    technical_difficulty = 4
                elif technical_difficulty_es == '\n\xa0Sólo expertos':
                    technical_difficulty = 5
            elif 'Tiempo' in data.xpath("text()").extract_first():
                time = data.xpath("span/text()").extract_first().strip()
            elif 'Coordenadas' in data.xpath("text()").extract_first():
                coordinates = data.xpath("span/text()").extract_first().strip()
            elif 'Fecha de subida' in data.xpath("text()").extract_first():
                upload_date = data.xpath("span/text()").extract_first().strip()
            elif 'Fecha de realización' in data.xpath("text()").extract_first():
                recorded_date = data.xpath("span/text()").extract_first().strip()
            elif 'Valoración' in data.xpath("text()").extract_first():
                stars = int(data.xpath("following-sibling::span//@class").extract_first()[-1])

        #
        route = Route(
            external_id=route_id,
            title=title.strip(),
            route_type=route_type,
            route_loop=route_loop,
            technical_difficulty=technical_difficulty,
            route_length=route_length,
            route_uphill=route_uphill,
            route_downhill=route_downhill,
            route_height=route_height,
            route_low=route_low,
            time=time,
            coordinates=coordinates,
            upload_date=upload_date,
            recorded_date=recorded_date,
            stars=stars,
            start_point=Point(lat, lon),
            line=generate_line(gpx_lat, gpx_lon)

        )
        route.save()

        yield {
            'title': title.strip(),
            'route_length': route_length,
            'route_loop': route_loop,
            'route_uphill': route_uphill,
            'route_downhill': route_downhill,
            'route_height': route_height,
            'route_low': route_low,
            'route_type': route_type,
            'lat': lat,
            'lon': lon,
            'technical_difficulty': technical_difficulty,
            'time': time,
            'coordinates': coordinates,
            'upload_date': upload_date,
            'recorded_date': recorded_date,
            'stars': stars,
        }
