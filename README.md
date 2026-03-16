# E.S.T - Engineering Support Troop

Internal team webpage for EST. A static site with a built-in admin panel that stores all configuration in the browser's localStorage.

## Quick Start (Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later)

### Run Locally
```bash
npm install
npx serve . -l 3000
```
Open `http://localhost:3000` in your browser.

---

## Hosting on an Intranet

Since this is a fully static site (HTML, CSS, JS, images), any web server can host it. Below are instructions for running it as a persistent intranet site on **Ubuntu** and **Windows**.

---

### Ubuntu / Linux

#### Option 1: Nginx (Recommended)

1. **Install Nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

2. **Copy the site files:**
   ```bash
   sudo mkdir -p /var/www/est
   sudo cp -r ./* /var/www/est/
   sudo chown -R www-data:www-data /var/www/est
   ```

3. **Create an Nginx config:**
   ```bash
   sudo nano /etc/nginx/sites-available/est
   ```
   Paste the following (replace `your-server-ip` with the machine's IP or hostname):
   ```nginx
   server {
       listen 80;
       server_name your-server-ip;

       root /var/www/est;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

4. **Enable the site and restart Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/est /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default   # optional: remove default site
   sudo nginx -t                               # test config
   sudo systemctl restart nginx
   sudo systemctl enable nginx                 # start on boot
   ```

5. **Access the site** from any machine on the network at `http://your-server-ip`.

#### Option 2: Node.js with systemd

1. **Install Node.js:**
   ```bash
   sudo apt install nodejs npm -y
   ```

2. **Copy the site and install dependencies:**
   ```bash
   sudo mkdir -p /opt/est
   sudo cp -r ./* /opt/est/
   cd /opt/est
   sudo npm install
   ```

3. **Create a systemd service:**
   ```bash
   sudo nano /etc/systemd/system/est.service
   ```
   Paste:
   ```ini
   [Unit]
   Description=E.S.T Website
   After=network.target

   [Service]
   Type=simple
   WorkingDirectory=/opt/est
   ExecStart=/usr/bin/npx serve . -l 3000
   Restart=always
   RestartSec=5
   User=www-data

   [Install]
   WantedBy=multi-user.target
   ```

4. **Enable and start:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start est
   sudo systemctl enable est
   ```

5. **Access at** `http://your-server-ip:3000`.

---

### Windows

#### Option 1: IIS (Recommended for Windows Server)

1. **Enable IIS** via "Turn Windows features on or off" > check "Internet Information Services".

2. **Copy the site files** to `C:\inetpub\est\` (create the folder).

3. **Create a new site in IIS Manager:**
   - Open IIS Manager (`inetmgr`)
   - Right-click "Sites" > "Add Website"
   - Site name: `EST`
   - Physical path: `C:\inetpub\est`
   - Binding: port `80` (or your preferred port), IP: All Unassigned
   - Click OK

4. **Add MIME types** (if `.js` or `.json` files aren't served):
   - Select the site > MIME Types > Add:
     - `.js` = `application/javascript`
     - `.json` = `application/json`

5. **Access at** `http://your-server-ip` from any machine on the network.

#### Option 2: Node.js as a Windows Service

1. **Install Node.js** from https://nodejs.org/.

2. **Copy the site** to a permanent location, e.g. `C:\est`.

3. **Install dependencies:**
   ```cmd
   cd C:\est
   npm install
   ```

4. **Install node-windows to run as a service:**
   ```cmd
   npm install -g node-windows
   ```

5. **Create a service script** (`install-service.js`):
   ```js
   const { Service } = require('node-windows');
   const svc = new Service({
       name: 'EST Website',
       description: 'E.S.T Engineering Support Troop website',
       script: require.resolve('serve/build/main.js'),
       scriptOptions: '. -l 3000',
       workingDirectory: 'C:\\est'
   });
   svc.on('install', () => svc.start());
   svc.install();
   ```
   Run it: `node install-service.js`

6. **Access at** `http://your-server-ip:3000`.

#### Option 3: Simple Startup (Quick & Easy)

1. Create a batch file `start-est.bat`:
   ```batch
   @echo off
   cd /d C:\est
   npx serve . -l 3000
   ```

2. Place it in the Windows Startup folder (`shell:startup`) to auto-launch on login.

3. **Access at** `http://your-server-ip:3000`.

---

## Firewall

Ensure the chosen port (80 or 3000) is allowed through the firewall:

- **Ubuntu:** `sudo ufw allow 80/tcp`
- **Windows:** Add an inbound rule in Windows Defender Firewall for TCP port 80 (or 3000)

---

## Admin Panel

Click **Admin** in the nav bar to log in. Default credentials are defined in `data.js` under `settings.adminUser` and `settings.adminPass`. Change these after first login via the Settings tab.

All admin changes are stored in the browser's **localStorage**. This means:
- Each browser/device has its own saved state
- Clearing browser data resets to defaults from `data.js`
- To share changes across devices, update the defaults in `data.js`

---

## Updating the Site

To update the site after making changes:

1. Edit files locally and test with `npx serve . -l 3000`
2. Copy updated files to the server, replacing the old ones
3. If using Nginx/IIS, no restart needed - just refresh the browser
4. If using Node.js serve, restart the service:
   - Ubuntu: `sudo systemctl restart est`
   - Windows: Restart the service from Services Manager

## Project Structure

```
index.html    - Page structure
styles.css    - All styling
app.js        - Rendering, admin panel, animations
data.js       - Default site content and configuration
*.png         - Logo and image assets
```
