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


let url = window.location.pathname
console.log(url);

let main = document.querySelector('#main');

if (url === '/') {

    let template = `
    <header>
        <h1>Doctor Appointment Calendar</h1>
        <button class="btn btn--green" onclick="openCreateDialog()">create appointment</button>
    </header>

    <main style="padding: 30px;">
        <div class="calender">
            <div class="calender__item calender__item--header">
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn--black" onclick="previousMonth()">&#60;</button>
                    <button class="btn btn--black" onclick="nextMonth()">&#62;</button>
                    <form style="margin: 0 10px;">
                        <select class="from_control" name="view" id="">
                            <option value="month">Monthly</option>
                        </select>
                    </form>
                </div>
                <h1 class="month"></h1>
            </div>
            <div class="calender__item">
                <div class="week">
                    <div class="week__item">Wednesday</div>
                    <div class="week__item">Thursday</div>
                    <div class="week__item">Friday</div>
                    <div class="week__item">Satureday</div>
                    <div class="week__item">Sanday</div>
                    <div class="week__item">Monday</div>
                    <div class="week__item">Tuesday</div>
                </div>
            </div>
            <div class="calender__item calender__item--body">
                <div class="days">
                </div>
            </div>
        </div>

    </main>

    <!-- preview Dialog -->
    <dialog id="previewAppointmentDialog" class="preview-dialog">
        <button class="btn btn--close" type="button" onclick="closePreviewDialog()">&#x2716;</button>
        <div id="previewConent"></div>
    </dialog>

    <!-- Create Dialog -->
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
    main.innerHTML = template;
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

    const previewModal = document.querySelector('#previewAppointmentDialog');

    const openPreviewModal = (appointment) => {
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
        if (typeof previewModal.showModal === "function") {
            previewModal.close();
        } else {
            outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
        }
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
            let dayElement = document.createElement('button')

            dayElement.classList.add('days__item')
            if (day.getMonth() !== dateInstence.getMonth()) dayElement.setAttribute('disabled', '')
            if (isToday) dayElement.classList.add('days__item--today')
            dayElement.innerHTML = day.getDate()
            dayElement.style.fontSize = 'xx-large'
            days.append(dayElement)

            let appointments = state.appointmentList.map(appointment => {
                appointment.schedule = new Date(`${appointment.date} ${appointment.time}`);
                return appointment;
            }).filter(appointment => new Date(appointment.date).getTime() == day.getTime())
                .sort((a, b) => a.schedule - b.schedule)
            let listElement = document.createElement('div')
            // list item
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
        }
    }

    printMonth(dateInstence.getMonth(), dateInstence.getFullYear())

    const createModal = document.querySelector('#createAppointmentDialog');

    if (typeof createModal.showModal !== 'function') {
        createModal.hidden = true;
    }
    if (typeof previewModal.showModal !== 'function') {
        previewModal.hidden = true;
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
} else if (url.match(new RegExp(/\/month\/[0-9]*-[0-9]*/gm))) {
    
    const printMonth = (dateInstence) => {

        let listElement = document.createAttribute('a')
        let today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        for (const day of dateInstence.getCurrentMonth(true)) {
            day.setUTCHours(0, 0, 0, 0)
            let isToday = day.getTime() == today.getTime()
            let dayElement = document.createElement('button')

            dayElement.classList.add('days__item')
            if (day.getMonth() !== dateInstence.getMonth()) dayElement.setAttribute('disabled', '')
            if (isToday) dayElement.classList.add('days__item--today')
            dayElement.innerHTML = day.getDate()
            dayElement.style.fontSize = 'xx-large'
            main.append(dayElement)
            dayElement.appendChild(listElement)
            return listElement;
        }
    }


    let params = url.split('/').pop().split('-')
    for (let index = params[0]; index < params[1]; index++) {
        let date = new Date();
        date.setMonth(index);
        let month = new DateInstence(date)

        printMonth(month)

        console.log(month.getCurrentMonth());
    }
} else {
    console.log('Error 404');
}
