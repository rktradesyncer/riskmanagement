import Hapi from '@hapi/hapi';

export class DocsController {

  constructor() { }

  public docs(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const LOGO_URL = process.env.LOGO_URL || "https://firebasestorage.googleapis.com/v0/b/prop-9f30a.appspot.com/o/images%2FLogo%20(1).png?alt=media&token=8757078d-3711-4f78-9af4-4b8d717aadea";
    const html = `<!DOCTYPE html>
<html>
<head>
<title>Tradesyncer Risk Management API</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="icon" type="image/png" href="${LOGO_URL}" />
<style>
  body {
    margin: 0;
    padding: 0;
  }
  :root {
    --scalar-custom-header-height: 56px;
  }
  .custom-header {
    position: sticky;
    top: 0;
    z-index: 100;
    height: var(--scalar-custom-header-height);
    background-color: var(--scalar-background-1);
    box-shadow: inset 0 -1px 0 var(--scalar-border-color);
    color: var(--scalar-color-1);
    font-size: var(--scalar-font-size-2);
    padding: 0 18px;
    justify-content: space-between;
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .scalar-app .sidebar {
    top: var(--scalar-custom-header-height) !important;
    height: calc(100vh - var(--scalar-custom-header-height)) !important;
  }
  .custom-header .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: inherit;
  }
  .custom-header .logo img {
    height: 32px;
    width: auto;
    border-radius: 6px;
  }
  .custom-header .logo span {
    font-weight: 600;
    font-size: 18px;
  }
  .custom-header nav {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .custom-header nav a {
    color: var(--scalar-color-2);
    text-decoration: none;
    font-size: 14px;
  }
  .custom-header nav a:hover {
    color: var(--scalar-color-1);
  }
</style>
</head>
<body>
<header class="custom-header scalar-app">
  <a href="https://tradesyncer.com" class="logo" target="_blank">
    <img src="${LOGO_URL}" alt="Tradesyncer" />
    <span>Tradesyncer Risk Management API</span>
  </a>
  <nav>
    <a href="https://tradesyncer.com" target="_blank">Website</a>
    <a href="https://github.com/tradesyncer" target="_blank">GitHub</a>
  </nav>
</header>
<script id="api-reference" data-url="/risk-management/swagger.json"></script>
<script>
  document.getElementById('api-reference').dataset.configuration = JSON.stringify({
    theme: 'purple',
    darkMode: true,
    layout: 'modern',
    hideModels: true,
    hideDownloadButton: true,
    hideClientButton: true,
    hiddenClients: true,
    metaData: {
      title: 'Tradesyncer Risk Management API',
    },
  });
</script>
<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;
    return h.response(html).type("text/html");
  }

}
