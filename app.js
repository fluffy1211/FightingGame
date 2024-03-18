const game = document.querySelector('.game');

// 2) Créer une classe Player
// Cette classe contiendra : le nom (name), les points de vie (health), la (mana) et une spec
// Cette classe aura aussi les méthodes :
// createPlayer (dans le constructeur et affichera visuellement notre joueur)
// attack (enlève 10 points de vie à l'autre joueur)
// getDetails (affichera le nom et les points de vie + mana)
// setOpponent (permet de définir l'opposant)
// die (qui vient vérifier si le joueur n'a plus de vie, si c'est le cas afficher un message et désactiver les boutons)



class Player {
    constructor(name, spec, health, mana) {
        this.name = name;
        this.spec = spec;
        this.health = health;
        this.mana = mana;
        this.opponent = null;
        this.card = this.createPlayer();
    }

    getDetails() {
        return `${this.name} (${this.spec})`;
    }

    attack() {
        if (this.opponent.health > 10) {
            this.opponent.health -= 10
            this.opponent.card.querySelector('.health').textContent = `Health : ${this.opponent.health}`
        } else {
            this.opponent.card.textContent = "You are dead ..."
        }
    }

    specAttack() {
        if (this.opponent.health > 10) {
            this.opponent.health -= 20;
            this.opponent.card.querySelector('.health').textContent = `Health : ${this.opponent.health}`;
        } else {
            this.opponent.card.textContent = "T'es mort gros naze"
        }
    }

    createPlayer() {
        const card = document.createElement('div');
        card.classList.add(`${this.name}-card`);

        card.innerHTML = `
            <h2>${this.getDetails()}</h2>
            <p class="health">Health :${this.health}</p>
            <p class="mana">Mana :${this.mana}</p>
            <button class="attack-btn">Attack</button>
            <button class="spec-btn">Special Attack</button>`;

        const attackButton = card.querySelector('.attack-btn');
        const specAttackButton = card.querySelector('.spec-btn');

        // Ecouteur d'évènement pour l'attaque
        attackButton.addEventListener('click', () => {
            this.attack(this.opponent);
        });

        // Ecouteur d'évènement pour l'attaque spéciale
        specAttackButton.addEventListener('click', () => {
            this.specAttack(this.opponent);
        });

        card.append(attackButton, specAttackButton);
        game.appendChild(card);

        return card;
    }

    setOpponent(opponent) {
        this.opponent = opponent;
    }
}

const input1 = document.querySelector('.input1');
const input2 = document.querySelector('.input2');
const start = document.querySelector('.start');

start.addEventListener('click', () => {
    const Zac = new Player(input1.value, 'Princesse', 100, 100);
    const Gabriel = new Player(input2.value, 'SDF', 100, 100);
    input1.remove();
    input2.remove();
    start.remove();

    Zac.setOpponent(Gabriel);
    Gabriel.setOpponent(Zac);
});


