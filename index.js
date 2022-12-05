import fs from 'fs';

const routes = fs.readFileSync('./routes.txt', 'utf-8');

if (fs.existsSync('./krakend.json')) {
    fs.unlinkSync('./krakend.json');
}

const route_lines = routes.split('\r\n');

var host = '';

const dirty_krakend_routes = route_lines.map((route) => {
    if (route == '') {
        return;
    }

    if (route.slice(0, 1) == '-') {
        host = route.slice(1);
        return;
    }

    const [method, endpoint] = route.split(' - ');
    const output_encoding = "no-op";
    const headers_to_pass = ["*"];

    const encoding = "no-op";
    const url_pattern = `${endpoint}`;


    const backend = [
        {
            encoding,
            url_pattern,
            method,
            host,
        }
    ];

    const krakend_route = {
        endpoint,
        output_encoding,
        headers_to_pass,
        method,
        backend,
    };

    return krakend_route;
})

const krakend_routes = dirty_krakend_routes.filter((route) => route);

const stringified_krakend_routes = JSON.stringify(krakend_routes, null, 2);

fs.writeFileSync('./krakend.json', stringified_krakend_routes);
