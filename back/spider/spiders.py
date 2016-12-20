# -*- coding: utf-8 -*-
import logging

import scrapy
from django.contrib.gis.geos import Point, LineString

from api.models import Route

activities_en = [
    'mountain-biking',
    'hiking',
    'cycling',
    'running',
    'trail-running',
    'mountaineering',
    'bicycle-touring',
    'walking',
    'motorcycling',
    'back-country-skiing',
    'trail-bike',
    'atv',
    'kayaking-canoeing',
    'sailing',
    'snowshoeing',
    'cross-country-skiing',
    'alpine-skiing',
    'flying',
    'horseback-riding',
    'dog-sledging',
    'rock-climbing',
    'inline-skating',
    'skating',
    'train',
    'canyoneering',
    'diving',
    'caving',
    'hang-gliding',
    'ballooning',
    'snowboarding',
    'ice-climbing',
    'snowmobiling',
    'accessible',
    'offroading',
    'rowing',
    'car',
    'kiteboarding',
    'kite-skiing',
    'sledge',
    'kickbike',
    'paragliding',
    'for-blind',
    'nordic-walking',
    'motorcycle-trials',
    'enduro',
    'via-ferrata',
    'swimming',
    'orienteering',
    'multisport',
    'stand-up-paddle-sup',
    'barefoot',
    'canicross',
    'roller-skiing',
    'longboarding',
    'mountain-unicycling',
    'golf',
    'recreational-vehicle',
    'airboat',
    'segway',
    'camel',
    'freeride',
    'unmanned-aerial-vehicle-uav',
    'motorboat',
    'birdwatching-birding',
    'trailer-bike',
    'water-scooter-pwc',
    'handbike',
    'rafting',
    'downhill-mountain-biking-dh',
    'electric-vehicle',
    'base-jumping',
    'joelette',
    'with-baby-carriage',
    'splitboard',
    'cyclocross',
]

activities_es = [
    'mountain-bike',
    'senderismo',
    'ciclismo',
    'carrera',
    'carrera-por-montana',
    'alpinismo',
    'cicloturismo',
    'a-pie',
    'motociclismo',
    'esqui-de-montana',
    'moto-trail',
    'quad',
    'kayac',
    'vela',
    'raquetas',
    'esqui-de-fondo',
    'esqui',
    'avion',
    'a-caballo',
    'trineo-de-perros',
    'escalada',
    'patines-en-linea',
    'patines',
    'tren',
    'descenso-de-barrancos',
    'submarinismo',
    'espeleologia',
    'ala-delta',
    'globo',
    'snowboard',
    'escalada-invernal',
    'moto-de-nieve',
    'sendero-accesible',
    'todo-terreno',
    'remo',
    'coche',
    'kiteboarding',
    'kite-skiing',
    'trineo',
    'kickbike',
    'parapente',
    'para-invidentes',
    'marcha-nordica',
    'moto-trial',
    'moto-enduro',
    'via-ferrata',
    'natacion',
    'orientacion',
    'prueba-combinada',
    'stand-up-paddle-sup',
    'correr-descalzo',
    'canicross',
    'skiroll',
    'longboarding',
    'monociclismo-de-montana',
    'golf',
    'autocaravana',
    'hidrodeslizador',
    'segway',
    'a-camello',
    'freeride',
    'vehiculo-aereo-no-tripulado-dron',
    'lancha-motora',
    'observacion-de-aves',
    'bicicleta-con-remolque',
    'moto-de-agua',
    'handbike',
    'descenso-de-rios-rafting',
    'descenso-mtb',
    'vehiculo-electrico',
    'salto-base',
    'joelette',
    'con-cochecito',
    'splitboard',
    'ciclocross',
]


class RoutesSpider(scrapy.Spider):
    name = "routes"

    def start_requests(self):
        url = 'https://es.wikiloc.com/wikiloc/view.do?id='
        route_id = getattr(self, 'route_id', None)
        if route_id is not None:
            url = url + str(route_id)
            yield scrapy.Request(url, self.parse)
        else:
            logging.error("Wikiloc route ID is mandatory")

    def generate_line(self, gpx_lat, gpx_lon):
        points = []
        for i in range(len(gpx_lat)):
            points.append(Point(gpx_lat[i], gpx_lon[i]))
        return LineString(points)

    def generate_gpx(self, title, gpx_lat, gpx_lon):
        gpx = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>'
        gpx += '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="Oregon 400t" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">'
        gpx += '<trk>'
        gpx += '<name>{}</name>'.format(title)
        gpx += '<trkseg>'

        for i in range(len(gpx_lat)):
            gpx += '<trkpt lat="{}" lon="{}">'.format(gpx_lat[i], gpx_lon[i])
            gpx += '</trkpt>'
        gpx += '</trkseg>'
        gpx += '</trk>'
        gpx += '</gpx>'

        return gpx

    def parse(self, response):
        self.log('Starting!')

        url = response.url
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
            line=self.generate_line(gpx_lat, gpx_lon)

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
