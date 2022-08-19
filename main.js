class DateInstence {
    #date
    #monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    constructor(date = new Date) {
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
        return this.#monthName[this.#date.getMonth()];
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
            this.#date.setFullYear(date.getFullYear() - 1);
        }
    }

    getCurrentMonth(fullCalender = false) {
        let preMonthDate = []
        let nextMonthDate = []
        for (let i = 0; i < this.#date.getDay(); i++) {
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

const dateInstence = new DateInstence();

let state = localStorage.state ? JSON.parse(localStorage.state) : {
    appointmentList: []
}

const save = () => {
    localStorage.state = JSON.stringify(state)
    state = JSON.parse(localStorage.state) || {}
}

const nextMonth = () => {
    dateInstence.nextMonth();
    printMonth(dateInstence.getMonth(), dateInstence.getFullYear())
}

const previousMonth = () => {
    dateInstence.previousMonth();
    printMonth(dateInstence.getMonth(), dateInstence.getFullYear())
}

const printMonth = (month, year) => {
    let today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    let days = document.querySelector('.days');
    let monthDiv = document.querySelector('.month');

    days.innerHTML = ''
    monthDiv.innerHTML = ''

    monthDiv.innerHTML = dateInstence.monthName() + ', ' + dateInstence.getFullYear()

    for (const day of dateInstence.getCurrentMonth(true)) {
        day.setUTCHours(0, 0, 0, 0)
        let isToday = day.getTime() == today.getTime()
        let dayElement = document.createElement('button');

        dayElement.classList.add('days__item')
        if (day.getMonth() !== dateInstence.getMonth()) dayElement.setAttribute('disabled', '');
        if (isToday) dayElement.classList.add('days__item--today')
        dayElement.innerHTML = day.getDate()
        days.append(dayElement);

        let appointments = state.appointmentList.filter(appointment => new Date(appointment.date).getTime() == day.getTime())
        let listElement = document.createElement('div');
        listElement.classList.add('appointments')
        for (const appointment of appointments) {
            let appointmentItem = document.createElement('div')
            appointmentItem.innerHTML = appointment.first_name
            appointmentItem.classList.add('appointments__item')
            listElement.appendChild(appointmentItem)
        }
        dayElement.appendChild(listElement)
    }
}

printMonth(dateInstence.getMonth(), dateInstence.getFullYear())

const createModal = document.querySelector('#createAppointmentDialog');

if (typeof createModal.showModal !== 'function') {
    createModal.hidden = true;
}

const openCreateDialog = () => {
    if (typeof createModal.showModal === "function") {
        createModal.showModal();
    } else {
        outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
    }
}

const closeCreateDialog = () => {
    if (typeof createModal.showModal === "function") {
        createModal.close();
    } else {
        outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
    }
}

// createModal.addEventListener('close', (e) => {
//     console.log('close', e);
// });

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
    printMonth(dateInstence.getMonth(), dateInstence.getFullYear())
});

