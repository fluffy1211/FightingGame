const game = document.querySelector('.game')


// Création de la classe Game 
class Game {
    static new() {
        game.innerHTML = `
            <h2>Welcome !</h2>
            <input type="text" placeholder="Your hero's name here ...">
            <h2>Choose your profile : </h2>
            <select>
                <option value="Warrior">Warrior</option>
                <option value="Wizard">Wizard</option>
                <option value="Barbarian">Barbarian</option>
                <option value="Mercenary">Mercenary</option>
                <option value="Nullard">Nullard</option>
                <option value="à son prime">à son prime</option>
                </select>
            <button>GO</button>
        `


        const btn = document.querySelector('button')
        
        btn.addEventListener('click', () => {
            const name = document.querySelector('input').value
            const profile = document.querySelector('select').value

            if (name.length > 0) {
                // Création de la zone pour les dés et les messages suite aux attaques
                game.innerHTML = "<div class=\"zone\"></div>"

                let url = `https://thronesapi.com/api/v2/Characters`

                axios.get(url)
                .then(res => {
                    const random = Math.floor(Math.random() * res.data.length)
                    const character = res.data[random]
                    console.log(character)

                    const gotname = character.fullName
                    const gottitle = character.title
                    const gotavatar = character.imageUrl

                    const avatar = "dice-assets/web-dev.png"

                    // Création du joueur 1 (nous) et du joueur 2 (ennemi)
                    const player1 = new Player(name, profile, avatar)
                    const player2 = new Player(gotname, gottitle, gotavatar)
                
    
                    player1.setOpponent(player2)
                    player2.setOpponent(player1)

                })
                .catch(err => {
                    console.log(err)
                })


            } else {
                const error = document.createElement('p')
                error.innerHTML += "<p class=\"error\" style=\"color: darkred\"><b>Please give a name to your hero !</b></p>"
                game.appendChild(error)
            }
        })
    }

    static newDice() {
        // On génère un chiffre aléatoire entre 1 et 6
        const random = Math.floor(Math.random() * 6) + 1

        const img = document.createElement('img')
        img.classList.add('dice')

        img.src = `./dice-assets/dice-six-faces-${random}.png`

        return img
    }

    static rollDice() {
        const zone = document.querySelector('.zone')
        let newDice = this.newDice()

        zone.appendChild(newDice)

        const interval = setInterval(() => {
            let diceImg = document.querySelector('.dice')
            let newDice = this.newDice()

            diceImg.src = newDice.src
        }, 80)

        setTimeout(() => {
            clearInterval(interval)
        }, 1500)
    }
}


// Création de la classe PLayer
class Player {
    constructor(name, spec, avatar) {
        this.avatar = avatar
        this.name = name
        this.health = 100
        this.mana = 100
        this.spec = spec
        this.opponent = null

        this.card = this.createPlayer()
    }

    // getDetails retourne le nom et la spé du joueur
    getDetails() {
        return `${this.name} (${this.spec})`
    }

    // attack qui attaque notre opposant
    attack() {
        const zone = document.querySelector('.zone')
        const dice = document.querySelector('.dice')
        const diceFace = dice.src.slice(-5, -4)

        if (diceFace > 3) {
            zone.innerHTML += "<h2 style=\"color: darkgreen\">Attack successful !</h2>" 

           

            if (this.opponent.health > 10) {
                this.opponent.health -= 10
                this.opponent.card.querySelector('.health').textContent = `Health : ${this.opponent.health}`
            } else {
                this.opponent.card.textContent = "You are dead ..."
            }
        } else {
            zone.innerHTML += "<h2 style=\"color: darkred\">Attack failed</h2>" 

        }

        if (this.mana > 10) {
            this.mana -= 10
            this.card.querySelector('.mana').textContent = `Mana : ${this.mana}`
        } else {
            this.card.textContent = "You are out of mana ..."
        }
    }

    specialAttack() {
        const zone = document.querySelector('.zone')
        const dice = document.querySelector('.dice')
        const diceFace = dice.src.slice(-5, -4)

        if (diceFace > 3) {
            zone.innerHTML += "<h2 style=\"color: darkgreen\">Special Attack successful !</h2>" 

            if (this.mana > 20) {
                this.mana -= 20
                this.card.querySelector('.mana').textContent = `Mana : ${this.mana}`
            }

            if (this.opponent.health > 20) {
                this.opponent.health -= 20
                this.opponent.card.querySelector('.health').textContent = `Health : ${this.opponent.health}`
            } else {
                this.opponent.card.textContent = "You are dead ..."
            }
        } else {
            zone.innerHTML += "<h2 style=\"color: darkred\">Special Attack failed</h2>" 

        }
    }

    // createPlayer
    createPlayer() {
        // Je crée ma "card" pour mon joueur, c'est à dire son affichage
        const card = document.createElement('div')
    

        card.innerHTML = `
            <img class="avatar" src="${this.avatar}" alt="avatar">
            <h2>${this.getDetails()}</h2>
            <p class="health">Health : ${this.health}</p>
            <p class="mana">Mana : ${this.mana}</p>
            <button class="attack-btn">Attack</button>
            <button class="spec-btn">Special Attack</button>
            <br><br>
        `
        const attackBtn = card.querySelector('.attack-btn')
        const specBtn = card.querySelector('.spec-btn')

        // Écouteur d'événement pour l'attaque spéciale
        specBtn.addEventListener('click', () => {
            document.querySelector('.zone').innerHTML = ""
            
            Game.rollDice()

            setTimeout(() => {
                this.specialAttack()
            }, 1550)
        })

        // Écouteur d'événement pour l'attaque
        attackBtn.addEventListener('click', () => {
            document.querySelector('.zone').innerHTML = ""
            
            Game.rollDice()

            setTimeout(() => {
                this.attack()
            }, 1550)
        })

        // J'ajoute ma card à mon jeu
        game.appendChild(card)
        return card
    }

    // setOpponent pour précisr qui est l'ennemi
    setOpponent(opponent) {
        this.opponent = opponent
    }
}

Game.new()

// TO DO 

// 1) Récupérer les infos du joueur adverse depuis l'API got : soit aléatoirement, soit de manière plus 
// linéaire (du personnage le plus faible au plus fort). Le nom, le profile, et une image
// 2) On veut aussi une photo d'office pour notre joueur
// 3) Prendre en compte la mana : lors d'une attaque simple on pourrait perdre 10 de mana
// 4) S'occuper de l'attaque spéciale. Idéalement chaque profile a une attaque spécial. Une attaque spéciale 
// aurait des effets supérieurs à la normale et consomme 20 de mana
// 5) Faire en sorte que le joueur adverse puisse attaquer à son tour

// Lien de l'API : https://thronesapi.com


// Afficher le personnage (nom, profile, image) dans le jeu
// Créer une fonction pour afficher le personnages



    