class DateInstence {
    #date
    #monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    constructor(date = new Date()) {
        this.#date = date
    }

    getDate() {
        return this.#date
    }

    getMonth() {
        return this.#date.getMonth()
    }

    getFullYear() {
        return this.#date.getFullYear()
    }

    monthName() {
        return this.#monthName[this.#date.getMonth()]
    }

    getAllMonth() {
        return this.#monthName
    }

    getNextMonth() {
        return this.#getDaysInMonth(this.#date.getMonth() < 11 ? this.#date.getMonth() + 1 : 0, this.#date.getMonth() < 11 ? this.#date.getFullYear() : this.#date.getFullYear() + 1)
    }
    getPreviousMonth() {
        return this.#getDaysInMonth(this.#date.getMonth() > 0 ? this.#date.getMonth() - 1 : 11, this.#date.getMonth() > 0 ? this.#date.getFullYear() : this.#date.getFullYear() - 1)
    }

    nextMonth() {
        if (this.#date.getMonth() < 11) this.#date.setMonth(this.#date.getMonth() + 1)
        else {
            this.#date.setMonth(0)
            this.#date.setFullYear(this.#date.getFullYear() + 1);
        }
    }

    previousMonth() {
        if (this.#date.getMonth() > 0) this.#date.setMonth(this.#date.getMonth() - 1)
        else {
            this.#date.setMonth(11)
            this.#date.setFullYear(this.#date.getFullYear() - 1);
        }
    }

    setMonth(month) {
        this.#date.setMonth(month)
    }

    getCurrentMonth(fullCalender = false) {
        let firstDay = new Date(`${this.#date.getMonth()+1}-01-${this.#date.getFullYear()}`)
        let preMonthDate = []
        let nextMonthDate = []
        for (let i = 0; i < firstDay.getDay(); i++) {
            preMonthDate.push(this.getPreviousMonth()[(this.getPreviousMonth().length - 1) - i])
        }
        for (let i = 0; i < 42 - (this.#getDaysInMonth(this.#date.getMonth(), this.#date.getFullYear()).length + preMonthDate.length); i++) {
            nextMonthDate.push(this.getNextMonth()[i])
        }
        if (fullCalender) return [...preMonthDate.reverse(), ...this.#getDaysInMonth(this.getMonth(), this.getFullYear()), ...nextMonthDate];
        else return this.#getDaysInMonth(this.getMonth(), this.getFullYear())
    }

    #getDaysInMonth(month, year) {
        let date = new Date(year, month, 1);
        let days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }
}

// components
const headerComponent = (title = 'Doctor Appointment Calendar') => {
    const header = document.createElement('header')
    const h1 = document.createElement('h1')
    h1.innerHTML = title

    const button = document.createElement('button')
    button.innerHTML = 'Create appointment'
    button.classList.add('btn')
    button.classList.add('btn--green')
    button.addEventListener('click', () => {
        openCreateDialog();
    })

    header.append(h1, button)
    return header
}

const dayComponent = (day, dateInstence, withAppointment = true) => {
    let today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    day.setUTCHours(0, 0, 0, 0)
    let isToday = day.getTime() == today.getTime()

    // 
    let dayElement = document.createElement('button')

    dayElement.classList.add('days__item')
    if (day.getMonth() !== dateInstence.getMonth()) dayElement.setAttribute('disabled', '')
    if (isToday) dayElement.classList.add('days__item--today')
    dayElement.innerHTML = day.getDate()
    dayElement.style.fontSize = 'xx-large'
    
    if(!withAppointment) return dayElement;

    let appointments = state.appointmentList.map(appointment => {
        appointment.schedule = new Date(`${appointment.date} ${appointment.time}`);
        return appointment;
    }).filter(appointment => new Date(appointment.date).getTime() == day.getTime())
        .sort((a, b) => a.schedule - b.schedule)

    // list item
    let listElement = document.createElement('div')

    listElement.classList.add('appointments')
    for (const appointment of appointments) {
        let appointmentItem = document.createElement('div')
        appointmentItem.addEventListener('click', () => {
            openPreviewModal(appointment)
        })
        appointmentItem.innerHTML = appointment.first_name
        appointmentItem.classList.add('appointments__item')
        listElement.appendChild(appointmentItem)
    }

    dayElement.appendChild(listElement)

    return dayElement;
}

const calenderComponent = (dateInstence, minimum = false) => {
    const calender = document.createElement('div')
    if(!minimum) calender.style.padding = '30px'
    calender.classList.add('calender')

    const previousButton = document.createElement('button')
    previousButton.classList.add('btn')
    previousButton.classList.add('btn--black')
    previousButton.innerHTML = '&#60;'
    previousButton.addEventListener('click', () => {
        previousMonth()
    })

    const nextButton = document.createElement('button')
    nextButton.classList.add('btn')
    nextButton.classList.add('btn--black')
    nextButton.innerHTML = '&#62;'
    nextButton.addEventListener('click', () => {
        nextMonth()
    })

    const form = document.createElement('form')
    form.style.margin = '0 10px'
    const months = document.createElement('select')
    months.classList.add('from_control')

    for ( let i = 0; i < dateInstence.getAllMonth().length; i++) {
        let month = dateInstence.getAllMonth()[i]
        let option = document.createElement("option");
        if(dateInstence.getMonth() == i) option.selected = true
        option.value = i;
        option.text = month
        months.add(option)
    }
    form.append(months);
    form.addEventListener('change', (e) => {
        let month = e.target.value
        dateInstence.setMonth(month)
        app.innerHTML = ''
        app.append(home())
    })

    const div = document.createElement('div')
    div.style.display = 'flex'
    div.style.gap = '10px'
    if(!minimum) div.append(previousButton, nextButton, form)

    const monthName = document.createElement('h1')
    monthName.innerHTML = `${dateInstence.monthName()}, ${ dateInstence.getFullYear()}`

    const calenderHeader = document.createElement('div')
    calenderHeader.classList.add('calender__item')
    calenderHeader.classList.add('calender__item--header')
    if(minimum) calenderHeader.classList.add('calender__item--header--min')
    calenderHeader.append(div, monthName)

    const week = document.createElement('div')
    week.classList.add('calender__item')
    if(!minimum){
        week.innerHTML = `
            <div class="week">
                <div class="week__item">Satureday</div>
                <div class="week__item">Sanday</div>
                <div class="week__item">Monday</div>
                <div class="week__item">Tuesday</div>
                <div class="week__item">Wednesday</div>
                <div class="week__item">Thursday</div>
                <div class="week__item">Friday</div>
            </div>
        `
    }else {
        week.innerHTML = `
            <div class="week">
                <div class="week__item">S</div>
                <div class="week__item">S</div>
                <div class="week__item">M</div>
                <div class="week__item">T</div>
                <div class="week__item">W</div>
                <div class="week__item">T</div>
                <div class="week__item">F</div>
            </div>
        `
    }
    const days = document.createElement('div')
    days.classList.add('days')
    for (const day of dateInstence.getCurrentMonth(true)) {
        let dayComp = dayComponent(day, dateInstence, !minimum)
        if(minimum) dayComp.classList.add('days__item--min')
        days.append(dayComp)
    }

    const body = document.createElement('div')
    body.classList.add('calender__item')
    body.classList.add('calender__item--body')

    body.append(days)

    calender.append(calenderHeader, week, days)

    return calender;
}

const footer = () => {
    let footer = document.createElement('footer')

    let createModal = document.createElement('div')
    createModal.innerHTML = `
    <dialog id="createAppointmentDialog">
        <form method="dialog" class="form">
            <h3>Create an appointment</h3>
            <div class="form__input">
                <label for="first_name">First name</label>
                <input type="text" name="first_name" placeholder="First name" maxlength="40" required>
            </div>
            <div class="form__input">
                <label for="last_name">Last ame</label>
                <input type="text" name="last_name" placeholder="Last name" maxlength="40" required>
            </div>
            <div class="form__input">
                <label for="email">Email</label>
                <input type="email" name="email" placeholder="example@demo.com" required>
            </div>
            <div style="display: flex; gap: 15px;">
                <div class="form__input">
                    <label for="age">Age</label>
                    <input type="number" name="age" placeholder="Age">
                </div>
                <div class="form__input">
                    <label for="gender">Gender</label>
                    <div style="padding: 5px 0;">
                        <input type="radio" name="gender" value="male"> Male
                        <input type="radio" name="gender" value="female"> Female
                        <input type="radio" name="gender" value="others"> Others
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 15px;">
                <div class="form__input">
                    <label for="date">Date</label>
                    <input type="date" name="date" required>
                </div>
                <div class="form__input">
                    <label for="tile">Time</label>
                    <input type="time" name="time" required>
                </div>
            </div>
            <hr>
            <div class="form__input" style="display: flex; flex-direction: row;">
                <button class="btn btn--red" type="button" onclick="closeCreateDialog()">Close</button>
                <input type="submit" class="btn btn--green" value="Create"></button>
            </div>
        </form>
    </dialog>
    `

    let previewModal = document.createElement('div')
    previewModal.innerHTML = `
        <dialog id="previewAppointmentDialog" class="preview-dialog">
            <button class="btn btn--close" type="button" onclick="closePreviewDialog()">&#x2716;</button>
            <div id="previewConent"></div>
        </dialog>
    `

    footer.append(createModal, previewModal)

    return footer
}

// pages
const home = () => {
    const home = document.createElement('div')
    home.append(headerComponent(), calenderComponent(dateInstence), footer());

    return home;
}

// application
let app = document.querySelector('#main');
const dateInstence = new DateInstence();

// global state
let state = localStorage.state ? JSON.parse(localStorage.state) : {
    appointmentList: []
}

// actions
const save = () => {
    localStorage.state = JSON.stringify(state)
    state = JSON.parse(localStorage.state) || {}
}

// router
let url = window.location.pathname

if (url === '/') {
    app.append(home())
} else if (url.match(new RegExp(/\/month\/[0-9]*-[0-9]*/gm))) {
    let params = url.split('/').pop().split('-')
    const calender = document.createElement('div')
    calender.classList.add('calender--root')
    for (let index = params[0]-1; index < params[1]; index++) {
        let date = new Date();
        date.setMonth(index);
        const month = new DateInstence(date)
        calender.append(calenderComponent(month, true))
        app.append(calender)
    }
} else {
    console.log('Error 404');
}



// dialog

const nextMonth = () => {
    dateInstence.nextMonth();
    app.innerHTML = ''
    app.append(home())
}

const previousMonth = () => {
    dateInstence.previousMonth();
    app.innerHTML = ''
    app.append(home())
}

const openCreateDialog = () => {
    const createModal = document.querySelector('#createAppointmentDialog');
    if (typeof createModal.showModal === "function") {
        createModal.showModal();
    } else {
        outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
    }

    createModal.addEventListener('submit', (formDataEvent) => {
        let formData = new FormData(formDataEvent.target);

        let first_name = formData.get('first_name');
        let last_name = formData.get('last_name');
        let email = formData.get('email');
        let age = formData.get('age');
        let gender = formData.get('gender');
        let date = formData.get('date');
        let time = formData.get('time');

        let appointment = { first_name, last_name, email, age, gender, date, time }

        state.appointmentList.push(appointment);

        save()
        app.innerHTML = ''
        app.append(home())
    });
}

const closeCreateDialog = () => {
    const createModal = document.querySelector('#createAppointmentDialog');
    if (typeof createModal.showModal === "function") {
        createModal.close();
    } else {
        outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
    }
}

const openPreviewModal = (appointment) => {
    const previewModal = document.querySelector('#previewAppointmentDialog');
    const root = document.createElement('div');

    root.innerHTML = `
        <div class="appointments_card">
            <div class="appointments_card__header" style="display: flex; flex-direction: column; gap: 10px;">
                <h3>${appointment.first_name} ${appointment.last_name}</h3>
                <div style="display: flex; gap: 15px;">
                    <div>Age: ${appointment.age}</div>
                    <div>Email: <a href="mainlto:${appointment.email}">${appointment.email}</a></div>
                </div>
            </div>
            <div class="appointments_card__body">
                <img width="100" src="https://cdn-icons-png.flaticon.com/512/470/470326.png" alt="">
                <div>
                    <div>${appointment.date}</div>
                    <div>${appointment.time}</div>
                </div>
            </div>
        </div>
`

    let previewConent = document.querySelector('#previewConent');
    previewConent.innerHTML = ''
    previewConent.append(root)

    if (typeof previewModal.showModal === "function") {
        previewModal.showModal();
    } else {
        outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
    }
}

const closePreviewDialog = () => {
    const previewModal = document.querySelector('#previewAppointmentDialog');
    if (typeof previewModal.showModal === "function") {
        previewModal.close();
    } else {
        outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
    }
}


