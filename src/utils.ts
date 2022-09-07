export const getDiceValue = () => { 
    return Math.floor(Math.random() * 6) + 1;
}

export const  determineDefenderDamage = (attacker: number, defender: number) =>{
    const damage = attacker - defender;
    if (damage > 0) return damage;
    return 0;
}