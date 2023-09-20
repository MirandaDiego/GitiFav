import { GithubUser } from "./GithubUser.js"

const starButton = document.querySelector('path')
const button = document.querySelector('.buttonHeader')

button.addEventListener('mouseenter', () => {
    starButton.classList.add('selecionado')

})
button.addEventListener('mouseleave', () => {
    starButton.classList.remove('selecionado')

})

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }
    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username){
        try {
            const userExist = this.entries.find(entry => entry.login === username)

            if(userExist){
                throw new Error('Usuario já cadastrado!')
            }
            const user = await GithubUser.search(username)

        if(user.login === undefined){
            throw new Error('Usuário não encontrado!')
        }
        this.entries = [user, ...this.entries]
        this.update()
        this.save()



    }catch(error){
        alert(error.message)
    }
        
        }
    
    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)


        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()

    }
    onadd() {
        const addButton = this.root.querySelector('.buttonHeader')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)
        }
    }
   
    update() {
        this.removeAlltr()


        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('tem certeza que deseja deletar essa linha?')
                if (isOk) {
                    this.delete(user)
                }
            }
            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')  //criando um lemento pelo DOM
        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/MirandaDiego.png" alt="MirandaDiego">
            <a href="https://github.com/MirandaDiego" target="_blank">
                <p>Diego Miranda</p>
                <span>MirandaDiego</span>
            </a>
        </td>
        <td class="repositories">
            34
        </td>
        <td class="followers">
            34
        </td>
        <td>
            <button class="remove" >Remover</button>
        </td>
    `
   return tr
    }

    removeAlltr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }

}