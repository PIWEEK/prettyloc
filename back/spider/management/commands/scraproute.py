from django.core.management import BaseCommand
from scrapy.crawler import CrawlerProcess

from spider.spiders import RoutesSpider



class Command(BaseCommand):
    # Show this when the user types help
    help = "Scrap some wikiloc routes"

    def add_arguments(self, parser):
        # Positional arguments
        parser.add_argument('route_id', nargs='+', type=int)

    # A command must define handle()
    def handle(self, *args, **options):
        process = CrawlerProcess({
            'USER_AGENT': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'
        })
        for route_id in options['route_id']:
            self.stdout.write("Scrapping route {}".format(route_id))
            process.crawl(RoutesSpider, route_id=route_id)
            process.start()  # the script will block here until the crawling is finished


