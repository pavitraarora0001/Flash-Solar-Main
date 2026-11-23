async function main() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  console.log('Homepage HTTP Status:', res.status);
  console.log('Includes solar-photovoltaic-generation.jpg:', html.includes('solar-photovoltaic-generation.jpg'));
  console.log('Includes flash-power-wall.jpg:', html.includes('flash-power-wall.jpg'));
  console.log('Includes COMMERCIAL SOLAR FARM badge:', html.includes('COMMERCIAL SOLAR FARM'));
  console.log('Includes 100% NATIVE DC GENERATION badge:', html.includes('100% NATIVE DC GENERATION'));
  console.log('Includes AUTHENTIC FLASH POWER WALL badge:', html.includes('AUTHENTIC FLASH POWER WALL'));
  console.log('Includes 120V - 450V DC specification:', html.includes('120V - 450V DC'));
  console.log('Includes 51.2 V DC (48V Safe) specification:', html.includes('51.2 V DC (48V Safe)'));
  console.log('Includes 6,000+ Cycles specification:', html.includes('6,000+ Cycles'));
  console.log('Includes Request Power Wall Datasheet & Sizing:', html.includes('Request Power Wall Datasheet & Sizing'));
  console.log('Contains old Stage 1 schematic placeholder:', html.includes('/schematics/solar-farm.svg'));
}
main();

export {};
