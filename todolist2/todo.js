
const dummyData = [
	{
		id: (new Date(400)).getTime(),
		isChecked: true,
		text: '첫번째 할일'
	},
	{
		id: (new Date(800)).getTime(),
		isChecked: false,
		text: '두번째 할일'
	},
	{
		id: (new Date(1000)).getTime(),
		isChecked: false,
		text: '세번째 할일'
	}
]

let originData = [...dummyData]
const selectedClassName = 'selected'
let renderType = 'all';

const completeAllBtn = document.querySelector('.complete-all-btn')
const todoInput = document.querySelector('.todo-input')
const todoList = document.querySelector('.todo-list')
const leftItemDiv = document.querySelector('.left-items')

const buttonGroup = document.querySelector('.button-group')
const buttonGroupChilds = document.querySelectorAll('.button-group > button')

const clearButton = document.querySelector('.clear-completed-btn')

const getDefaultData = (text) => ({
	id: (new Date()).getTime(),
	isChecked: false,
	text
})

const getRenderTypeData = (cmd) => {
	switch(cmd) {
		case 'all': return originData;
		case 'active': return originData.filter((d) => !d.isChecked);
		case 'completed': return originData.filter((d) => d.isChecked);
	}
}

const updateRender = (cmd, params) => {
	if(cmd === 'append') {
		const newData = getDefaultData(params.text)
		originData.push(newData)
		if(renderType === 'all' || renderType === 'active') {
			todoList.appendChild(generateDynamicLi(newData))			
		}
	} else if(cmd === 'remove') {
		originData = originData.filter((d) => d.id !== params.id)
		todoList.removeChild(params.el)
	} else if(cmd === 'all' || cmd === 'active' || cmd === 'completed') {
		todoList.innerHTML = ''
		const renderArr = getRenderTypeData(cmd)
		renderArr.forEach(renderInfo => {
			todoList.appendChild(generateDynamicLi(renderInfo))
		})
	} else {
		//error
	}
	updateActiveCount()
}

const updateActiveCount = () => {
	leftItemDiv.innerHTML = `${originData.filter((d) => !d.isChecked).length} items left`
}

const genCliChild = (renderData, parent) => {
	const checkBox = document.createElement('div')
	checkBox.classList.add('checkbox')
	
	const todo = document.createElement('div')
	todo.classList.add('todo')
	todo.innerHTML=renderData.text
	
	const button = document.createElement('button')
	button.classList.add('delBtn')
	button.innerHTML='x'
	renderData.isChecked && (checkBox.innerHTML = '✔')

	checkBox.addEventListener('click', () => {
		console.log(`checkbox click`)
		if(renderData.isChecked) {
			parent.classList.remove('checked')
			checkBox.innerHTML = ''
		} else {
			parent.classList.add('checked')
			checkBox.innerHTML = '✔'
		}
		renderData.isChecked = !renderData.isChecked;
		updateActiveCount()
	})
	
	button.addEventListener('click', () => {
		console.log(`del btn click`)
		updateRender('remove', {id: renderData.id, el: parent})
	})

	return {checkBox, todo, button}
}

const generateDynamicLi = (renderData) => {
	const li = document.createElement('li')
	const {checkBox, todo, button} = genCliChild(renderData, li)
	const currentLiClass = ['todo-item']
	renderData.isChecked && currentLiClass.push('checked')

	li.classList.add(...currentLiClass)
	li.id = renderData.id
	li.appendChild(checkBox)
	li.appendChild(todo)
	li.appendChild(button)

	
	li.addEventListener('dblclick', () => {
		const todoText = li.querySelector('.todo')
		if(todoText) {
			li.innerHTML = ''
			const inputTag = document.createElement('input')
			inputTag.classList.add('edit-input')
			inputTag.value = todoText.innerHTML
			inputTag.addEventListener('keypress', (event) => {
				
				if(event.keyCode === 13 && event.target.value !== '') {
					console.log(`Enpter Click`)
					
					renderData.text = event.target.value
					li.innerHTML = ''
					const {checkBox, todo, button} = genCliChild(renderData)
					li.appendChild(checkBox)
					li.appendChild(todo)
					li.appendChild(button)
				} 
			})
			li.appendChild(inputTag)
		}
	})

	return li
}

const fullRender = (renderDataArr) => {
	todoList.innerHTML = ''
	renderDataArr.forEach(renderInfo => {
		todoList.appendChild(generateDynamicLi(renderInfo))
	})
}

const init = () => {
	// register event
	// complete-all-btn 
	// Enter press event

	// this can support dynamic append
	// li > check box add Event
	// li > button add Event

	// bottom event not append data
	// <div class="button-group"> set Data

	todoInput.addEventListener('keypress', (event) => {
		if(event.keyCode === 13 && event.target.value !== '') {
			updateRender('append', {text: event.target.value})
			todoInput.value = ''
		} 
	})

	clearButton.addEventListener('click', () => {
		originData = originData.filter((d) => !d.isChecked)
		updateRender(renderType)	
	})

	completeAllBtn.addEventListener('click', () => {
		const renderData = getRenderTypeData(renderType)
		if(renderType === 'active' || renderType === 'completed') {
			const nextValue = renderType === 'active'
			renderData.forEach(d => d.isChecked = nextValue)
		} else if(renderType === 'all') {
			const comData = renderData.filter(d => d.isChecked)
			if(comData.length === renderData.length) {
				renderData.forEach(d => d.isChecked = false)
			} else {
				renderData.forEach(d => d.isChecked = true)
			}
		}
		updateRender(renderType)
	})

	buttonGroup.addEventListener('click', (event) => {
		if(event.target !== buttonGroup) {
			buttonGroupChilds.forEach(eachElem => {
				if(eachElem === event.target) {
					eachElem.classList.add('selected')
					renderType = eachElem.getAttribute('data-type')
				} else {
					eachElem.classList.remove('selected')
				}
			})
			updateRender(renderType)
		}
	})
	updateRender(renderType)
}

init()
