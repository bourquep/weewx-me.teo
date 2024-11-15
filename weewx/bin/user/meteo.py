from weewx.reportengine import ReportGenerator
import os.path
import logging

log = logging.getLogger(__name__)

class NextJsBasePathGenerator(ReportGenerator):
  def run(self):
    html_root = self.skin_dict.get('HTML_ROOT', self.config_dict['StdReport']['HTML_ROOT'])
    html_dest_dir = os.path.join(self.config_dict['WEEWX_ROOT'], html_root)
    html_subdir = self.skin_dict.get('HTML_SUBDIR', '')

    for root, dirs, files in os.walk(html_dest_dir):
      for file in files:
        if file.endswith('.html') or file.endswith('.js') or file.endswith('.css') or file.endswith('.txt'):
          filepath = os.path.join(root, file)
          try:
            with open(filepath, 'r') as f:
              content = f.read()

            if html_subdir == '':
              content = content.replace('/##METEO_BASE_PATH##', '')
            else:
              content = content.replace('##METEO_BASE_PATH##', html_subdir)

            with open(filepath, 'w') as f:
              f.write(content)
          except Exception as e:
            log.error("Unable to process '%s'. Got exception '%s': %s", filepath, type(e), e)
            pass
