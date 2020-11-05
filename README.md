## FreeTON Blockchain Explorer (frontend)

URL: https://ton-explorer.com

### Running in dev mode

1. clone this repository<br/> 
`git clone git@github.com:broxus/ton-explorer-frontend.git`  
`cd ton-explorer-frontend`  
2. install dependencies  
`npm install`  
3. (optional) edit settings in 
`ton-explorer-frontend/src/environments/environment.ts`  
`rootUrl` - you backend url (see https://github.com/broxus/ton-explorer-backend)
4. run application using `npm run start`
5. open `http://localhost:4200/` in your browser

### Generate services from swagger.yml
1. (only once) install ng-openapi-gen ```npm install -g ng-openapi-gen```
2. copy content of `%you_backend_url%/docs/docs.yaml` to `swagger.yml`
3. run `ng-openapi-gen --input swagger.yml --output src/app/api` in project root

### Build prod

1. clone this repository<br/> 
`git clone git@github.com:broxus/ton-explorer-frontend.git`  
`cd ton-explorer-frontend`  
2. install dependencies  
`npm install`  
3. edit settings in 
`ton-explorer-frontend/src/environments/environment.prod.ts`  
`rootUrl` - you backend url (see https://github.com/broxus/ton-explorer-backend)
`authBot` - you auth bot name, set it to null if you want to disable auth
4. build `npm run build`
5. copy contents of `dist` folder to your web-server. For example use nginx:
```
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html =404;
  }
}
```
