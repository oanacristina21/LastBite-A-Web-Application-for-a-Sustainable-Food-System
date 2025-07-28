import bcrypt from 'bcryptjs';


const parola = 'parola123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(parola, salt);

console.log('Parola hashuită:', hash);
