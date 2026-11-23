async function main() {
  const urls = [
    'http://localhost:3000/images/solar-photovoltaic-generation.jpg',
    'http://localhost:3000/images/flash-power-wall.jpg'
  ];
  for (const url of urls) {
    const res = await fetch(url);
    console.log(`URL: ${url}`);
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Content-Type: ${res.headers.get('content-type')}`);
    console.log(`Content-Length: ${res.headers.get('content-length')} bytes`);
    console.log('--------------------------------------------------');
  }
}
main();

export {};
