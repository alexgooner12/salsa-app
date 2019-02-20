const appStorage = {
    getListOfPeople() {
        const data = JSON.parse(localStorage.getItem('list-of-people')) || [];
        return data;
    },
    
    setListOfPeople() {
        localStorage.removeItem('list-of-people');
        localStorage.setItem('list-of-people', JSON.stringify(app.listOfPeople));
    },
    
    getDanceList() {
        const data = JSON.parse(localStorage.getItem('dance-list')) || [];
        return data;
    },
    
    setDanceList() {
        localStorage.removeItem('dance-list');
        localStorage.setItem('dance-list', JSON.stringify(app.danceList));
    },
    
    getDanceListByClass() {
        const data = JSON.parse(localStorage.getItem('dance-list-by-class')) || [];
        return data;
    },
    
    setDanceListByClass() {
        localStorage.removeItem('dance-list-by-class');
        localStorage.setItem('dance-list-by-class', JSON.stringify(app.danceListByClass));
    },
    
    getAttendanceList() {
        const data = JSON.parse(localStorage.getItem('attendance-list')) || [];
        return data; 
    },
    
    setAttendanceList() {
        localStorage.removeItem('attendance-list');
        localStorage.setItem('attendance-list', JSON.stringify(app.attendanceList));
    }
};

const handlers = {
    getCurrentMonth() {
        const monthDisplay = document.querySelector('.current-month');
        const monthIndex = new Date().getMonth();
        const listOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthDisplay.textContent = listOfMonths[monthIndex];
    },

    addDanceMove(event) {
        const input = document.querySelector('.dance-move-input');
        if (event.target.id === 'add-dance-move-button' && input.value) {
            app.danceList.push(input.value);
            input.value = '';
            appStorage.setDanceList();
            this.showDanceMoves();
        }
    },
    
    showDanceMoves() {
        const ul = document.querySelector('.list-of-dance-moves');
        ul.innerHTML = '';
        const danceList = appStorage.getDanceList();
        danceList.forEach((danceMove, index) => {
            const li = this.createDanceMoveLi(danceMove, index);
            const deleteButton = this.deleteDanceMoveButton('delete-dance-move-button', handlers.checkDeleteDanceMove.bind(this));
            li.appendChild(deleteButton);
            ul.appendChild(li);
        });
    },
    
    selectDanceMoves() {
        const selectElement = document.querySelector('#select-moves-for-today');
        selectElement.innerHTML = '';
        const danceMoves = app.danceList;
        danceMoves.forEach(danceMove => {
            const optionElement = this.createOptionElement(danceMove);
            selectElement.appendChild(optionElement);
        });
    },
    
    getSelectedDanceMoves() {
        const selectedElement = document.querySelector('#select-moves-for-today').selectedIndex;
        const danceMoves = [app.danceList[selectedElement]];
        const group = document.querySelector('.group-shower').textContent;
        const date = document.querySelector('.date-shower').textContent;
//        danceMoves.push(app.danceList[selectedElement]);
        function MovesByClass(group, date, danceMoves) {
            this.group = group;
            this.date = date; 
            this.danceMoves = danceMoves; /// pushuj sve korake u array dance moves. Dodaj nove korake na profil ucenika. mozda i rating koraka... 5 stars max..
        }
        const clas = new MovesByClass(group, date, danceMoves);
        const object = this.createSelectedDanceMoves(clas);
        if (!object)  { app.danceListByClass.push(clas); }
//        object.length = 0;
         else { object.danceMoves.push(clas.danceMoves); }
        
//        app.danceListByClass.push(new MovesByClass(group, date, danceMoves));
        appStorage.setDanceListByClass();
        this.showSelectedDanceMoves();
    },
    
    createSelectedDanceMoves(clas) { ////////////////// ?????? treba da prikazuje sadrzaj localStorage-a
        const danceListByClass = app.danceListByClass;
        for (let i = 0; i < danceListByClass.length; i++) {
            if (danceListByClass[i].group === clas.group && danceListByClass[i].date === clas.date) {
                return danceListByClass[i];
            } else {
                danceListByClass.push(clas);
            }
        }        
    },
    
    showSelectedDanceMoves() {
        const ul = document.querySelector('.dance-list-display-group-1'); 
        ul.innerHTML = '';
        app.danceListByClass.forEach(list => {
            if (list.danceMoves.length) {
                list.danceMoves.forEach((item, index) => {
                    const li = this.createDanceMoveLi(item, index);
                    const deleteButton = this.deleteDanceMoveButton('delete-selected-move', handlers.deleteSelectedMove);
                    li.appendChild(deleteButton);
                    ul.appendChild(li);
                });
            } 
        });
    },
    
    filterThruDanceList() {
        const input = document.querySelector('.dance-move-input');
        const ul = document.querySelector('.list-of-dance-moves').childNodes;
        ul.forEach(element => {
            if (element.textContent.startsWith(input.value)) {
                const index = element.textContent.indexOf(input.value.charAt(input.value.length - 1));
                const letter = element.textContent.charAt(index);
                element.textContent.replace(letter, `<span style="color: red;">${letter}</span>`);
            } 
        });
    },
    
    deleteSelectedMove(event) {
        const liIndex = Number(event.target.parentElement.id);
        const groupName = handlers.getGroupName(event.target.parentElement.parentElement.className);
        const group = handlers.getGroup(groupName);
        group.danceMoves.splice(liIndex, 1);
        appStorage.setDanceListByClass();
        handlers.showSelectedDanceMoves();
    },
    
    getGroup(groupName) {
        for (let i = 0; i < app.danceListByClass.length; i++) {
            if (app.danceListByClass[i].group.includes(groupName)) {
                return app.danceListByClass[i];
            }
        }   
    },
    
    getGroupName(className) {
        if (className.includes(1)) {
            return '1';
        } else if (className.includes(2)) {
            return '2';
        } else {
            return '3';
        }
    },
    
    createDanceMoveLi(danceMove, index) {
        const li = document.createElement('li');
        li.id = index;
        li.textContent = danceMove;
        return li;
    },
    
    deleteDanceMoveButton(className, method) {
        const button = document.createElement('button');
        const icon = document.createTextNode('x');
        button.className = className; // 'delete-dance-move-button'
        button.appendChild(icon);
        button.addEventListener('click', method); // handlers.checkDeleteDanceMove.bind(this)
        return button;
    },
    
    checkDeleteDanceMove(event) {
        if (event.target.className.includes('delete-dance-move-button')) {
            this.deleteDanceMove(event);
        }
    },
    
    deleteDanceMove(event) {
        const liId = Number(event.target.parentElement.id);
        app.danceList.splice(liId, 1);
        appStorage.setDanceList();
        this.showDanceMoves();   
    },
    
    getMemberName(event) {
        const name = event.target.value;  
        return name;
    },
    
    checkGetMemberName(event) {
        if (event.target.className.includes('member-name-input')) {
            this.getMemberName(event);
        }  
    },
    
    getNamesOfMembers() {
        const selectElement = document.querySelector('#list-of-members');
        selectElement.innerHTML = '';
        app.listOfPeople.forEach(person => {    
            const optionElement = this.createOptionElement(person);
            optionElement.value = person.name;
            optionElement.textContent = person.name;
            selectElement.appendChild(optionElement);
        });  
    },
    
    createOptionElement(person) {
        const optionElement = document.createElement('option');
        optionElement.value = person.name || person;
        optionElement.textContent = person.name || person;
        return optionElement;
    },
    
    sortPeopleList() {
        const selectedIndex = document.querySelector('#select').selectedIndex;
        if (selectedIndex === 0) {
            this.sortPeopleListByName();
        } else if (selectedIndex === 1) {
            this.sortPeopleListByGroup();
        } else {
            this.sortPeopleListByDate();
        }
    },
    
    sortPeopleListByName() {
        const list = app.listOfPeople;
        list.sort((a, b) => { 
            if (b.name > a.name) { 
                return -1;
            }
            else { 
                return 1;
            }
        });
        
        this.displayPeople(list);
    },
    
    sortPeopleListByDate() {
        const list = app.listOfPeople;
        list.sort((a, b) => { 
            if (b.startDate > a.startDate) {  
                return -1;
            } else {
                return 1;
            }
        });
        
        this.displayPeople(list);
    },
    
    sortPeopleListByGroup() {
        const list = app.listOfPeople;
        list.sort(a => { 
            if (a.group === 'beginner') {
                return -1;
            } else if (a.group === 'intermediate') {
                return 1;
            } else  if (a.group === 'advanced') {
                return 2;
            }
        });
        
        this.displayPeople(list);
    },
    
    displayPeople(sortedList) {
        const table = document.querySelector('.display-people-list');
        table.innerHTML = '';
        const list = sortedList || app.listOfPeople;
        list.forEach(person => {
            const tr = this.createTrElement();
            for (const prop in person) {
                const td = this.createTdElement(person[prop]);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        });
    },
    
    createTrElement() {
        const tr = document.createElement('tr');
        return tr;
    },
    
    createTdElement(person, className) {
        const td = document.createElement('td');
        td.textContent = person;
        td.classList.add(className);
        return td;
    },
    
    createNewMember() {
        const name = document.querySelector('.member-name-input').value;
        document.querySelector('.member-name-input').value = '';
        const startDate = document.querySelector('#start-date').value;
        document.querySelector('#start-date').value = '';
        const recommendedBy = document.querySelector('#recommended-input').value || document.querySelector('#list-of-members').value;
        document.querySelector('#list-of-members').value = '';
        document.querySelector('#recommended-input').value = '';
        const group = document.querySelector('#group').value;
        document.querySelector('#group').value = '';
        function Member(name, recommendedBy, startDate, group) {
            this.name = name;
            this.recommendedBy = recommendedBy;
            this.startDate = startDate;
            this.group = group;
        }
        app.listOfPeople.push(new Member(name, recommendedBy, startDate, group));
        appStorage.setListOfPeople();
    },
    
    createEvents() {
        const memberNameInput = document.querySelector('.member-name-input');
        memberNameInput.addEventListener('change', handlers.checkGetMemberName.bind(this));
    },

    getNextWeekend(day='') {
        const todaysDate = day || new Date();
        const todaysIndex = todaysDate.getDay();
        
        if (todaysIndex === 6) { // func 
            this.storeWeekend(todaysDate);
        } else {
            const nextDay = todaysDate.setDate(todaysDate.getDate() + 1);
            const day = new Date(nextDay);
            this.getNextWeekend(day);
        }
    },
    
    storeWeekend(todaysDate) {
        const weekend = [];
        const saturday = todaysDate.toLocaleDateString();
        const sunday = new Date(todaysDate.setDate(todaysDate.getDate() + 1)).toLocaleDateString();
        weekend.push(saturday, sunday);
        document.querySelector('.saturday-display').textContent = weekend[0];
        document.querySelector('.sunday-display').textContent = weekend[1];
        return weekend;    
    },
    
    createProfileContainer(className) {
        const article = document.createElement('article');
        article.classList.add(className);
        return article;
    },
    
    createProfileHeading(person, className) {
        const heading = document.createElement('h2');
        heading.textContent = person.name;
        heading.classList.add(className);
        return heading;
    },
    
    createProfileStartDate(person, className) {
        const label = document.createElement('label');
        label.textContent = person.date;
        label.classList.add(className);
        return label;
    },
    
    createProfileGroup(person, className) {
        const label = document.createElement('label');
        label.textContent = person.group;
        label.classList.add(className);
        return label;
    },
    
    createProfileRecommendation(person, className) {
        const label = document.createElement('label');
        label.textContent = person.recommendedBy;
        label.classList.add(className);
        return label;
    },
        
    createProfile() {
        const list = app.listOfPeople;
        list.forEach(person => {
            const article = this.createProfileContainer('person-shower');
            const heading = this.createProfileHeading(person, 'name-shower');
            const startDate = this.createProfileStartDate(person, 'start-date-shower');
            const group = this.createProfileGroup(person, 'group-shower');
            const recommendation = this.createProfileRecommendation(person, 'recommendation-shower');
            article.appendChild(heading);
            article.appendChild(startDate);
            article.appendChild(group);
            article.appendChild(recommendation);
            const profile = document.querySelector('.profile');
            profile.appendChild(article);
        });
    },
    
    createCheckbox(date) {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('data-text', date);
        checkbox.setAttribute('onchange', 'handlers.addPersonToAttendenceList(event)');
        return checkbox;
    },
      
    addPersonToAttendenceList(event) {
        const nameOfThePerson = document.querySelector('.person-name').textContent;
        const date = event.target.dataset.text;
        app.attendanceList.push({date, people: [] });
        appStorage.setAttendanceList();
    },
    
    displayAttendenceList() {
        const table = document.querySelector('.attendence-people-list');
        table.innerHTML = '';
        const list = app.listOfPeople;
        const saturdaysDate = document.querySelector('.saturday-display').textContent;
        const sundaysDate = document.querySelector('.sunday-display').textContent;
        list.forEach(person => {
            const tr = this.createTrElement();
            const tdName = this.createTdElement(person.name, 'person-name');
            const tdGroup = this.createTdElement(person.group);
            const tdCheckboxSaturday = this.createCheckbox(saturdaysDate);
            const tdCheckboxSunday = this.createCheckbox(sundaysDate);
            tr.appendChild(tdName);
            tr.appendChild(tdCheckboxSaturday);
            tr.appendChild(tdCheckboxSunday);
            tr.appendChild(tdGroup); 
            table.appendChild(tr);
        });
    }
};

const app = {
    listOfPeople: appStorage.getListOfPeople() || [],
    
    danceList: appStorage.getDanceList() || [],
    
    danceListByClass: appStorage.getDanceListByClass() || [],
    
    attendanceList: appStorage.getAttendanceList() || []
};
