from django.core.management import BaseCommand
from scrapy.crawler import CrawlerProcess

from spider.spiders import RoutesSpider


class Command(BaseCommand):
    # Show this when the user types help
    help = "Scrap some wikiloc routes from a search"

    def add_arguments(self, parser):
        # Positional arguments
        parser.add_argument('url', nargs='+', type=str)

    # A command must define handle()
    def handle(self, *args, **options):
        process = CrawlerProcess({
            'USER_AGENT': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'
        })
        for url in options['url']:
            self.stdout.write("Scrapping search {}".format(url))
            process.crawl(RoutesSpider, url=url)
            process.start()  # the script will block here until the crawling is finished
