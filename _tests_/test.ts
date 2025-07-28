// 1. Importam functia pe care vrem sa o testam
import { calcHaversine } from '@/utils/distance';
// 2. Incepem suita de teste cu 'describe'
describe('calcHaversine', () => {
  
  // 3. Definim un caz de test specific cu 'it'
  it('ar trebui sa calculeze corect distanta dintre doua puncte', () => {
    // Puncte de test: Bucuresti si Constanta
    const bucuresti = { lat: 44.4268, lon: 26.1025 };
    const constanta = { lat: 44.1807, lon: 28.6343 };
    
    // Apelam functia importata
    const distantaCalculata = calcHaversine(bucuresti.lat, bucuresti.lon, constanta.lat, constanta.lon);
    
    // 4. Verificam rezultatul cu 'expect'
    // Spunem testului sa verifice daca valoarea este apropiata de 203.3, cu o precizie de o zecimala
expect(distantaCalculata).toBeCloseTo(203.3, 1);
  });
  
  // Poti adauga si alte teste aici
  it('ar trebui sa returneze 0 pentru aceleasi coordonate', () => {
    const punct = { lat: 50, lon: 50 };
    const distanta = calcHaversine(punct.lat, punct.lon, punct.lat, punct.lon);
    expect(distanta).toBe(0);
  });
});