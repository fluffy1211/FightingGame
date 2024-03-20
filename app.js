const game = document.querySelector('.game');

// 2) Créer une classe Player
// Cette classe contiendra : le nom (name), les points de vie (health), la (mana) et une spec
// Cette classe aura aussi les méthodes :
// createPlayer (dans le constructeur et affichera visuellement notre joueur)
// attack (enlève 10 points de vie à l'autre joueur)
// getDetails (affichera le nom et les points de vie + mana)
// setOpponent (permet de définir l'opposant)
// die (qui vient vérifier si le joueur n'a plus de vie, si c'est le cas afficher un message et désactiver les boutons)



function rollDice() {
    const random = Math.floor(Math.random() * 6) + 1;

    const diceFace = document.createElement('img');
    diceFace.classList.add('dice');
    diceFace.src = `assets/${random}.png`;
    

    return diceFace;
}

game.appendChild(rollDice());

const interval = setInterval(() => {
    const dice = rollDice();
    const img = document.querySelector('img');
    img.src = dice.src;
},200);

const timeout = setTimeout(() => {
    clearInterval(interval);
}, 2000);



class Game {
    static new() {
        
        game.innerHTML = `
        <h2 class="welcome">Welcome !</h2>
        <input type="text" placeholder="Enter your name" class="input1">
        <p class="chooseClass">Choose your class</p>
        <select class="select">
            <option value="Mage">Mage</option>
            <option value="Warrior">Warrior</option>
            <option value="Rogue">Rogue</option>
            <option value="Priest">Priest</option>
            <option value="Paladin">Paladin</option>
        </select>
        <button class="start">Start</button>`;

        const input1 = document.querySelector('.input1');
        const select = document.querySelector('.select');
        const start = document.querySelector('.start');
        const welcome = document.querySelector('.welcome');
        const chooseClass = document.querySelector('.chooseClass');


        start.addEventListener('click', () => {
            const player1 = new Player(input1.value, select.value, 100, 100);
            const player2 = new Player('Gabriel', 'Mage', 100, 100);

            if (input1.value === '') {
                alert('Please enter your name');
                return;
            }


            input1.remove();
            select.remove();
            start.remove();
            welcome.remove();
            chooseClass.remove();

            player1.setOpponent(player2);
            player2.setOpponent(player1);
        });
    };
}




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

Game.new();


