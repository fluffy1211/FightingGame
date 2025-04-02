const game = document.querySelector('.game')

// Création de la classe Game 
class Game {
    static new() {
        game.innerHTML = `
            <h2 class="welcome">Welcome !</h2>
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
                    const player1 = new Player(name, profile, avatar, true)

                    const vs = document.createElement('img')
                    vs.classList.add('vs')
                    vs.src = "./dice-assets/vs.png"
                    game.appendChild(vs)
                    
                    const player2 = new Player(gotname, gottitle, gotavatar, false)
                
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

// Création de la classe Player
class Player {
    constructor(name, spec, avatar, current) {
        this.avatar = avatar
        this.name = name
        this.health = 100
        this.mana = 100
        this.spec = spec
        this.opponent = null
        this.current = current
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
            zone.innerHTML += `<h2 style=\"color: darkgreen\">${this.name}'s Attack successful !</h2>`

            if (this.opponent.health > 10) {
                this.opponent.health -= 10
                this.opponent.card.querySelector('.health').textContent = `Health : ${this.opponent.health}`
            } else {
                this.opponent.card.textContent = "You are dead ..."
            }
        } else {
            zone.innerHTML += `<h2 style=\"color: darkred\">${this.name}'s Attack failed</h2>`
        }

        const nextBtn = document.createElement('button')
        nextBtn.textContent = "Next"
        nextBtn.classList.add('next')
        zone.appendChild(nextBtn)

        nextBtn.addEventListener('click', () => {
            nextBtn.remove()
            document.querySelector('.zone').innerHTML = ""
            
            // Switch turns between players
            this.toggleTurn()
        })
    }

    specialAttack() {
        const zone = document.querySelector('.zone')
        const dice = document.querySelector('.dice')
        const diceFace = dice.src.slice(-5, -4)

        if (diceFace > 3) {
            zone.innerHTML += "<h2 style=\"color: darkgreen\">Special Attack successful !</h2>"

            if (this.mana > 30) {
                this.mana -= 30
                this.card.querySelector('.mana').textContent = `Mana : ${this.mana}`
            }

            if (this.opponent.health > 20) {
                switch (diceFace) {
                    case "6":
                        this.opponent.health -= 30
                        break
                    case "5":
                        this.opponent.health -= 20
                        break
                    case "4":
                        this.opponent.health -= 10
                        break
                    case "1":
                        this.health -= 10
                        break
                    default:
                        break
                }
                this.opponent.card.querySelector('.health').textContent = `Health : ${this.opponent.health}`
            } else {
                this.opponent.card.textContent = "You are dead ..."
            }
        } else {
            zone.innerHTML += "<h2 style=\"color: darkred\">Special Attack failed</h2>"
        }

        // Add "Next" button after special attack too
        const nextBtn = document.createElement('button')
        nextBtn.textContent = "Next"
        nextBtn.classList.add('next')
        zone.appendChild(nextBtn)

        nextBtn.addEventListener('click', () => {
            nextBtn.remove()
            document.querySelector('.zone').innerHTML = ""
            
            // Switch turns between players
            this.toggleTurn()
        })
    }

    // Add method to toggle turns between players
    toggleTurn() {
        // Switch current status
        this.current = false
        this.opponent.current = true
        
        // Update UI to reflect turn change
        this.card.classList.remove('current')
        this.opponent.card.classList.add('current')
        
        // Hide buttons for players based on whose turn it is
        // We DO NOT hide the cards, only the buttons
        const buttons = this.card.querySelectorAll('.attack-btn, .spec-btn');
        buttons.forEach(button => {
            button.style.display = "none";
        });
        
        const opponentButtons = this.opponent.card.querySelectorAll('.attack-btn, .spec-btn');
        if (this.opponent.name === document.querySelectorAll('.card')[0].querySelector('.name').textContent.split(' ')[0]) {
            // This is the human player's turn, show their buttons
            opponentButtons.forEach(button => {
                button.style.display = "inline-block";
            });
        } else {
            // This is the AI's turn, keep buttons hidden
            opponentButtons.forEach(button => {
                button.style.display = "none";
            });
            
            // AI plays automatically after a short delay
            setTimeout(() => {
                // AI randomly chooses between normal and special attack
                const attackType = Math.random() > 0.5 && this.opponent.mana >= 30 ? 'special' : 'normal';
                
                Game.rollDice()
                
                setTimeout(() => {
                    if (attackType === 'special') {
                        this.opponent.specialAttack()
                    } else {
                        this.opponent.attack()
                    }
                }, 1550)
            }, 1000)
        }
    }

    // createPlayer
    createPlayer() {
        // Je crée ma "card" pour mon joueur, c'est à dire son affichage
        const card = document.createElement('div')
        card.classList.add('card')

        if (this.current === true) {
            card.classList.add('current')
        } else {
            card.classList.remove('current')
        }
    
        card.innerHTML = `
            <img class="avatar" src="${this.avatar}" alt="avatar">
            <h2 class="name">${this.getDetails()}</h2>
            <p class="health">Health : ${this.health}</p>
            <p class="mana">Mana : ${this.mana}</p>
            <button class="attack-btn">Attack</button>
            <button class="spec-btn">Special Attack</button>
            <br><br>
        `
        const attackBtn = card.querySelector('.attack-btn')
        const specBtn = card.querySelector('.spec-btn')

        // Hide buttons initially if not current player
        if (!this.current) {
            attackBtn.style.display = "none";
            specBtn.style.display = "none";
        }

        // Écouteur d'événement pour l'attaque spéciale
        specBtn.addEventListener('click', () => {
            // Only allow action if it's this player's turn
            if (!this.current) return;
            
            document.querySelector('.zone').innerHTML = ""
           
            if (this.mana < 30) {
                document.querySelector('.zone').innerHTML = "<h2 style=\"color: darkred\">Not enough mana !</h2>"
                return
            }

            if (this.mana >= 30) {
                Game.rollDice()
            }

            setTimeout(() => {
                this.specialAttack()
            }, 1550)
        })

        // Écouteur d'événement pour l'attaque
        attackBtn.addEventListener('click', () => {
            // Only allow action if it's this player's turn
            if (!this.current) return;
            
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






