import json
import os
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.getcwd()
CERTIFICATE_DIR = os.path.join(ROOT, 'assets', 'pdf', 'certificates')

class SecurePortfolioHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def _send_json(self, payload, status=200):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _is_safe_pdf_name(self, name):
        if not name:
            return False
        if os.path.basename(name) != name:
            return False
        return name.lower().endswith('.pdf') and os.path.isfile(os.path.join(CERTIFICATE_DIR, name))

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/certificates':
            files = []
            if os.path.isdir(CERTIFICATE_DIR):
                for name in sorted(os.listdir(CERTIFICATE_DIR)):
                    if name.lower().endswith('.pdf'):
                        files.append('assets/pdf/certificates/' + name)
            self._send_json({'certificates': files})
            return

        if path == '/api/certificate':
            query = urllib.parse.parse_qs(parsed.query)
            file_name = query.get('file', [None])[0]
            if not self._is_safe_pdf_name(file_name):
                self.send_error(404, 'Certificate not found')
                return

            pdf_path = os.path.join(CERTIFICATE_DIR, os.path.basename(file_name))
            try:
                with open(pdf_path, 'rb') as pdf_file:
                    content = pdf_file.read()
            except Exception:
                self.send_error(404, 'Certificate not found')
                return

            self.send_response(200)
            self.send_header('Content-Type', 'application/pdf')
            self.send_header('Content-Disposition', 'inline; filename="' + os.path.basename(pdf_path) + '"')
            self.send_header('Content-Length', str(len(content)))
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('Content-Security-Policy', "default-src 'self' 'unsafe-inline'; frame-ancestors 'self'")
            self.end_headers()
            self.wfile.write(content)
            return

        if path == '/assets/pdf/certificates/' or path == '/assets/pdf/certificates':
            self.send_response(403)
            self.end_headers()
            return

        return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    server = ThreadingHTTPServer(('localhost', 8000), SecurePortfolioHandler)
    print('secure server running on port 8000')
    server.serve_forever()
