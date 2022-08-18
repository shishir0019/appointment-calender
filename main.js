class DateInstence {
    #date
    #monthName
    constructor() {
        this.#date = new Date()
        this.#monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
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

    getCurrentMonth() {
        return this.#getDaysInMonth(this.getMonth(), this.getFullYear())
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

const date = new DateInstence();

const nextMonth = () => {
    date.nextMonth();
    printMonth(date.getMonth(), date.getFullYear())
}

const previousMonth = () => {
    date.previousMonth();
    printMonth(date.getMonth(), date.getFullYear())
}

const printMonth = (month, year) => {
    console.log(date.monthName());
    let days = document.querySelector('.days');
    let monthDiv = document.querySelector('.month');

    days.innerHTML = ''
    monthDiv.innerHTML = ''

    monthDiv.innerHTML = date.monthName() + ', ' + date.getFullYear()

    for (const day of date.getCurrentMonth().map(day => day.getDate())) {
        let dayElement = document.createElement('div');
        dayElement.innerHTML = day
        days.appendChild(dayElement);
    }
}

printMonth(date.getMonth(), date.getFullYear())
