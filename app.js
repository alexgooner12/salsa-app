const appStorage = {
    keys: {
        danceList: 'dance-list', listOfPeople: 'list-of-people', listOfDanceSchedules: 'list-of-dance-schedules', attendanceList: 'attendance-list'
    },
    
    listOfPeople: {
        getListOfPeople() {
            return JSON.parse(localStorage.getItem(appStorage.keys.listOfPeople)) || [];
        },

        setListOfPeople() {
            localStorage.setItem(appStorage.keys.listOfPeople, JSON.stringify(app.listOfPeople));
        }
    },
    
    danceList: {
        getDanceList() {
            return JSON.parse(localStorage.getItem(appStorage.keys.danceList)) || [];
        },

        setDanceList() {
            localStorage.setItem(appStorage.keys.danceList, JSON.stringify(app.danceList));
        },  
    },
    
    listOfDanceSchedules: {
        getListOfDanceSchedules() {
            return JSON.parse(localStorage.getItem(appStorage.keys.listOfDanceSchedules)) || [];
        },

        setListOfDanceSchedules() {
            localStorage.setItem(appStorage.keys.listOfDanceSchedules, JSON.stringify(app.listOfDanceSchedules));
        }
    },
    
    attendanceList: {
        getAttendanceList() {
            return JSON.parse(localStorage.getItem(appStorage.keys.attendanceList)) || [];
        },

        setAttendanceList() {
            localStorage.setItem(appStorage.keys.attendanceList, JSON.stringify(app.attendanceList));
        }  
    }

};

const handlers = {
    getCurrentMonth() {
        const currentMonthElement = document.getElementsByClassName('current-month')[0];
        const currentMonthIndex = new Date().getMonth();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = monthNames[currentMonthIndex];
    },

    addDanceMove(event) {
        const input = document.getElementsByClassName('dance-move-input')[0];
        if (event.target.id === 'add-dance-move-button' && input.value) {
            app.danceList.push(input.value);
            input.value = '';
            appStorage.danceList.setDanceList();
            this.showDanceMoves();
        }
    },
    
    populateDanceListUlElements(danceListUl) {
        const danceList = appStorage.danceList.getDanceList();
        danceList.forEach((danceMove, index) => {
            const danceMoveLi = this.createDanceMoveLi(danceMove, index);
            const danceMoveDeleteButton = this.createDeleteDanceMoveButton('delete-dance-move-button', handlers.checkDeleteDanceMove.bind(this));
            danceMoveLi.appendChild(danceMoveDeleteButton);
            danceListUl.appendChild(danceMoveLi);
        });  
    },
    
    showDanceMoves() {
        const danceListUl = document.getElementsByClassName('list-of-dance-moves')[0];
        danceListUl.innerHTML = '';
        this.populateDanceListUlElements(danceListUl);
    },
    
    selectDanceMoves() {
        const selectElement = document.getElementById('select-moves-for-today');
        selectElement.innerHTML = '';
        const danceMoves = app.danceList;
        danceMoves.forEach(danceMove => {
            const optionElement = this.createOptionElement(danceMove);
            selectElement.appendChild(optionElement);
        });
    },
    getSelectedDanceMoves() {
        const danceMoveIndex = document.getElementById('select-moves-for-today').selectedIndex;
        const danceMoves = app.danceList[danceMoveIndex];
        const group = document.getElementsByClassName('group-shower')[0].textContent;
        const date = document.getElementsByClassName('date-shower')[0].textContent;
        
        const danceSchedule = this.createDanceSchedule(group, date, danceMoves);
        const isDanceScheduleCreated = this.isDanceScheduleCreated(danceSchedule);
        
        this.addDanceSchedule(isDanceScheduleCreated, danceSchedule, danceMoves); // pogresno postavljeno
        
        appStorage.listOfDanceSchedules.setListOfDanceSchedules();
        this.showSelectedDanceMoves();
    },
    
    addDanceSchedule(isDanceScheduleCreated, danceSchedule, danceMoves) {
        if (isDanceScheduleCreated)  { 
            const danceScheduleListOfMoves = this.getDanceScheduleListOfMoves(danceSchedule);
            const hasDanceMoveBeenAdded = this.checkIfDanceMoveHasBeenAdded(danceScheduleListOfMoves, danceMoves);
            if (!hasDanceMoveBeenAdded) {
                danceScheduleListOfMoves.push(danceMoves); 
            }
        } else {
            app.listOfDanceSchedules.push(danceSchedule);
        } 
    },
    
    checkIfDanceMoveHasBeenAdded(danceScheduleListOfMoves, danceMoves) {
        const list = danceScheduleListOfMoves;
        
        let result = false;
        if (list) { list.filter(el => (el === danceMoves) ? result = true : false); }
        return result;
    },
    
    getDanceScheduleListOfMoves(danceSchedule) {
        const listOfDanceSchedules = app.listOfDanceSchedules;
        
        let result;
        
        listOfDanceSchedules.filter((oldDanceSchedule, index) => {
             if (oldDanceSchedule.group === danceSchedule.group && oldDanceSchedule.date === danceSchedule.date) {
                 result = listOfDanceSchedules[index].danceMoves;
             }
        });
        
        return result;
        
    },
    
    isDanceScheduleCreated(danceSchedule) { 
        const listOfDanceSchedules = app.listOfDanceSchedules;
        let result;
        listOfDanceSchedules.forEach((dance, index) => {
            if (listOfDanceSchedules[index].group === danceSchedule.group && listOfDanceSchedules[index].date === danceSchedule.date) {
                result = true;
            } else {
                result = false;
            }
        });
        return result;
    },
    
    populateSelectedDanceMoves(ul) {
        app.listOfDanceSchedules.forEach(list => {
            if (list.danceMoves.length) {
                list.danceMoves.forEach((item, index) => {
                    const li = this.createDanceMoveLi(item, index);
                    const deleteButton = this.createDeleteDanceMoveButton('delete-selected-move', handlers.deleteSelectedMove);
                    li.appendChild(deleteButton);
                    ul.appendChild(li);
                });
            } 
        });
    },
    
    showSelectedDanceMoves() {
        const ul = document.getElementsByClassName('dance-list-display-group-1')[0];
        ul.innerHTML = ''; 
        this.populateSelectedDanceMoves(ul);
    },
    
    filterThruDanceList() {
        const input = document.getElementsByClassName('dance-move-input')[0];
        const ul = document.getElementsByClassName('list-of-dance-moves')[0].childNodes;
        if (ul) {
            ul.forEach(element => {
                if (element.textContent.startsWith(input.value)) {
                    const index = element.textContent.indexOf(input.value.charAt(input.value.length - 1));
                    const letter = element.textContent.charAt(index);
                    element.textContent.replace(letter, `<span style="color: red;">${letter}</span>`);
                } 
            });
        }
    },
    
    deleteSelectedMove(event) {
        const moveIndex = Number(event.target.parentElement.id);
        const groupName = handlers.getGroupName(event.target.parentElement.parentElement.className);
        const group = handlers.getGroup(groupName);
        group.danceMoves.splice(moveIndex, 1);
        appStorage.listOfDanceSchedules.setListOfDanceSchedules();
        handlers.showSelectedDanceMoves();
    },
    
    getGroup(groupName) { 
        let result;
        app.listOfDanceSchedules.filter(list => {
            if (list.group.includes(groupName)) {
                result = list; // filter
            }
        });
        return result;
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
    
    createDeleteDanceMoveButton(className, method) {
        const button = document.createElement('button');
        const icon = document.createTextNode('x');
        button.className = className;
        button.appendChild(icon);
        button.addEventListener('click', method);
        return button;
    },
    
    checkDeleteDanceMove(event) {
        if (event.target.className.includes('delete-dance-move-button')) {
            this.deleteDanceMove(event);
        }
    },
    
    deleteDanceMove(event) {
        const danceMoveIndex = Number(event.target.parentElement.id);
        app.danceList.splice(danceMoveIndex, 1);
        appStorage.danceList.setDanceList();
        this.showDanceMoves();   
    },
    
    getMemberName(event) {
        return event.target.value;  
    },
    
    checkGetMemberName(event) {
        if (event.target.className.includes('member-name-input')) {
            this.getMemberName(event);
        }  
    },
    
    getNamesOfMembers() {
        const selectElement = document.getElementById('list-of-members');
        selectElement.innerHTML = '';
        app.listOfPeople.forEach(person => {    
            const optionElement = this.createOptionElement(person.name);
            selectElement.appendChild(optionElement);
        });  
    },
    
    createOptionElement(value) {
        const optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.textContent = value; 
        return optionElement;
    },
    
    sortPeopleList() {
        const selectedIndex = document.getElementById('select').selectedIndex;
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
        
        this.displayPeople();
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
        
        this.displayPeople();
    },
    
    sortPeopleListByGroup() {
        const list = app.listOfPeople;
        list.sort(a => { 
            if (a.group === 'Group 1') {
                return -1;
            } else if (a.group === 'Group 2') {
                return 1;
            } else  if (a.group === 'Group 3') {
                return 2;
            }
        });
        
        this.displayPeople();
    },
    
    displayPeople() {
        const table = document.getElementsByClassName('display-people-list')[0];
        table.innerHTML = '';
        const list = app.listOfPeople;
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
    
    getNewMemberName() {
        const name = document.getElementsByClassName('member-name-input')[0].value;
        document.getElementsByClassName('member-name-input')[0].value = '';
        return name;
    },
    
    getNewMemberStartDate() {
        const startDate = document.getElementById('start-date').value;
        document.getElementById('start-date').value = '';
        return startDate;
    },
    
    getNewMemberRecommendation() {
        const recommendedBy = document.getElementById('recommended-input').value || document.getElementById('list-of-members').value;
        document.getElementById('list-of-members').value = '';
        document.getElementById('recommended-input').value = '';
        return recommendedBy;
    },
    
    getNewMemberGroup() {
        const group = document.getElementById('group').value;
        document.getElementById('group').value = ''; 
        return group;
    },
    
    getNewMemberInfo() {
        const name = this.getNewMemberName();
        const startDate = this.getNewMemberStartDate();
        const recommendedBy = this.getNewMemberRecommendation();
        const group = this.getNewMemberGroup();
        return [name, recommendedBy, startDate, group]; // has to be in the correct order !
    },
    
    addNewMember() {
        const newMemberInfo = this.getNewMemberInfo();
        const newMember = this.createNewMember(...newMemberInfo);  
        app.listOfPeople.push(newMember);
        appStorage.listOfPeople.setListOfPeople();
    },

    getNextWeekend(day='') {
        const todaysDate = day || new Date();
        const todaysIndex = todaysDate.getDay();
        
        if (todaysIndex === 6) { // func 
            this.storeWeekend(todaysDate); // ??
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
        document.getElementsByClassName('saturday-display')[0].textContent = weekend[0];
        document.getElementsByClassName('sunday-display')[0].textContent = weekend[1];
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
    
    populateProfileAttendenceHistory(ul, name) {
        app.attendanceList.forEach(element => {
            const list = element.peopleList; 
            list.forEach(person => {
                if (person.name === name) {
                    const li = document.createElement('li');
                    li.textContent = element.date;
                    ul.appendChild(li);  
                }
            });
        });
    },
    
    getProfileAttendenceHistory(name) {
        const ul = document.createElement('ul');
        ul.innerHTML = '';
        
        this.populateProfileAttendenceHistory(ul, name);
        return ul;
    },
    
    createProfileDanceList(danceList) {
        const ul = document.createElement('ul');
        danceList.forEach(element => {
            const li = document.createElement('li');
            li.textContent = element;
            ul.appendChild(li);
        });
        
        return ul;
    },
    
    populateProfileConteinerElements(person) {
        const article = this.createProfileContainer('person-shower');
        const heading = this.createProfileHeading(person, 'name-shower');
        const startDate = this.createProfileStartDate(person, 'start-date-shower');
        const group = this.createProfileGroup(person, 'group-shower');
        const recommendation = this.createProfileRecommendation(person, 'recommendation-shower');
        const attendenceHistory = this.getProfileAttendenceHistory(person.name);
        const danceList = this.createProfileDanceList(person.danceList);
        article.appendChild(heading);
        article.appendChild(startDate);
        article.appendChild(group);
        article.appendChild(recommendation);
        article.appendChild(attendenceHistory);
        article.appendChild(danceList); 
        return article;
    },
        
    createProfile() {
        const list = app.listOfPeople;
        const profile = document.getElementsByClassName('profile')[0];
        list.forEach(person => {
            const article = this.populateProfileConteinerElements(person);
            profile.appendChild(article);
        });
    },
    
    createCheckbox(date, name) {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('data-text', date);
        checkbox.addEventListener('change', handlers.checkAttendenceCheckbox);
        checkbox.checked = this.isPersonOnAttendenceList(date, name);
        return checkbox;
    },
    
    determineIfAttendenceListHasBeenCreated(date = '3/2/2019') {
        let result = false;
        app.attendanceList.forEach(list => {
            (list.date === date) ? result = true : false;  
        });
        return result;
    },
     
    checkAttendenceList(date) {
        const hasBeenCreated = this.determineIfAttendenceListHasBeenCreated();
        hasBeenCreated ? '' : this.addAttendenceList(date);  
    },
    
    addAttendenceList(date) {
        const list = this.createAttendenceList(date);
        app.attendanceList.push(list);  
        appStorage.attendanceList.setAttendanceList();   
    },
    
    checkAttendenceCheckbox(event) {
        const nameOfThePerson = event.target.parentElement.querySelector('.person-name').textContent;
        const groupOfThePerson = event.target.parentElement.querySelector('.person-group').textContent;
        const date = event.target.dataset.text;
        const isPersonOnAttendenceList = handlers.isPersonOnAttendenceList(date, nameOfThePerson);
        
        handlers.toggleAttendenceCheckbox(isPersonOnAttendenceList, date, nameOfThePerson, groupOfThePerson);

    },
    
    toggleAttendenceCheckbox(isPersonOnAttendenceList, date, nameOfThePerson, groupOfThePerson) {
        if (event.target.checked && !isPersonOnAttendenceList) {
            this.addPersonToAttendenceList(date, nameOfThePerson, groupOfThePerson);
        } else {
            this.removePersonFromAttendenceList(date, nameOfThePerson);
            this.removeDanceMovesFromPersonMistakenlyAddedToAttendeceList(date, nameOfThePerson, groupOfThePerson);
        } 
    },
      
    addPersonToAttendenceList(date, nameOfThePerson, groupOfThePerson) {
        app.attendanceList.forEach((list, index) => {
            if (list.date === date) {
                list.peopleList.push({name: nameOfThePerson, group: groupOfThePerson});
            }
        });
        
        appStorage.attendanceList.setAttendanceList();
        this.passEachDanceMoveToPerson(date, groupOfThePerson);     
    },
    
    passEachDanceMoveToPerson(date, groupOfThePerson) {
        const danceMove = this.getDanceScheduleDanceMoves(date, groupOfThePerson);
        if (danceMove) {
            danceMove.forEach(element => {
                this.addDanceMovesToPerson(element);
            });   
        }
    },
    
    isPersonOnAttendenceList(date, nameOfThePerson) {
        const list = app.attendanceList;
        let result = false;
        
        list.forEach(element => {
            if (element.date === date && element.peopleList.length) {
                element.peopleList.forEach(person =>  {
                    if (person.name === nameOfThePerson) {
                        result = true;
                    } 
                });
            } 
        });
        
        return result;
    },
    
    removePersonFromAttendenceList(date, nameOfThePerson) {
        const list = app.attendanceList;
        
        list.forEach(element => {
            if(element.date === date) {
                element.peopleList.forEach((person, index) => {
                    if (person.name === nameOfThePerson) {
                        element.peopleList.splice(index, 1);
                        appStorage.attendanceList.setAttendanceList();
                    } 
                });
            } 
        });
    },
    
    removeDanceMovesFromPersonMistakenlyAddedToAttendeceList(date, nameOfThePerson, groupofThePerson) {
        const danceMoves = this.getDanceMovesDoneOnThatDay(date, groupofThePerson);
        const person = this.getPerson(nameOfThePerson);
        const personDanceList = person[0].danceList;
        if (personDanceList.length) {
            const danceMovesIndexes = this.getDanceMovesIndexes(personDanceList, danceMoves);
        
            for (let i = personDanceList.length; i >= 0; i--) {
                personDanceList.splice(danceMovesIndexes[i], 1);
            }   
        }
        appStorage.listOfPeople.setListOfPeople(); 
    },
    
    getDanceMovesIndexes(personDanceList, danceMoves) {
        let result = [];
        danceMoves.forEach((danceMove, index) => {
            if (personDanceList.includes(danceMove)) {
                result.push(personDanceList.indexOf(danceMove));
            }    
        });
        
        return result;
          
    },
    
    getDanceMovesDoneOnThatDay(date, groupOfThePerson) {
        let danceMoves;
        app.listOfDanceSchedules.forEach(element => {
            if (element.date === date && element.group === groupOfThePerson) {
                danceMoves = element.danceMoves;
            } 
        });
        
        return danceMoves;
    },
    
    displayAttendenceList() {
        const table = document.getElementsByClassName('attendence-people-list')[0];
        table.innerHTML = '';
        const saturdaysDate = document.getElementsByClassName('saturday-display')[0].textContent;
        const sundaysDate = document.getElementsByClassName('sunday-display')[0].textContent;
        this.populateAttendenceList(table, saturdaysDate, sundaysDate);
    },
    
    populatePersonOnAttendenceList(person, table, saturdaysDate, sundaysDate) {
        const tr = this.createTrElement();
        const tdName = this.createTdElement(person.name, 'person-name');
        const tdGroup = this.createTdElement(person.group, 'person-group');
        const tdCheckboxSaturday = this.createCheckbox(saturdaysDate, person.name);
        const tdCheckboxSunday = this.createCheckbox(sundaysDate, person.name);
        tr.appendChild(tdName);
        tr.appendChild(tdCheckboxSaturday);
        tr.appendChild(tdCheckboxSunday);
        tr.appendChild(tdGroup); 
        table.appendChild(tr);  
    },
    
    populateAttendenceList(table, saturdaysDate, sundaysDate) {
        const list = app.listOfPeople;
        list.forEach(person => {
            this.populatePersonOnAttendenceList(person, table, saturdaysDate, sundaysDate);
        });   
    },
    
    getPerson(name) {
        const list = app.listOfPeople;
        let result = [];
        
        list.forEach(person => {
            this.getPersonResult(name, person, result);
        });
        
        return result;
    },
    
    getPersonResult(name, person, result) {
        if (Array.isArray(name)) {
            name.forEach(n => {
                if (person.name === n) {
                    result.push(person);
                } 
            });   
        } else if (person.name === name) {
            result.push(person);
        }  
    },
    
    determineNamesOfPeopleWhoHaveAttenedResult(listOfDanceSchedules, attendenceList) {
        let peopleWhoHaveAttendened = [];
        
        attendenceList.forEach((item, index) => {
            if (item.date === listOfDanceSchedules[index].date && item.peopleList[index].group === listOfDanceSchedules[index].group) {
                item.peopleList.forEach(person => peopleWhoHaveAttendened.push(person.name));
            }
        });
        
        return peopleWhoHaveAttendened;  
    },
    
    getNamesOfPeopleWhoHaveAttended() {
        const listOfDanceSchedules = app.listOfDanceSchedules;
        const attendenceList = app.attendanceList;
        const namesOfPeopleWhoHaveAttended = this.determineNamesOfPeopleWhoHaveAttenedResult(listOfDanceSchedules, attendenceList);
        return namesOfPeopleWhoHaveAttended;
    },
    
    addDanceMovesToPerson(danceMoves= 'relo') {
        const namesOfPeople = this.getNamesOfPeopleWhoHaveAttended();
        const people = this.getPerson(namesOfPeople);
        
        people.forEach(person => {
            if (!person.danceList.includes(danceMoves)) {
                person.danceList.push(danceMoves);
            }
        });
        
        appStorage.listOfPeople.setListOfPeople();
    },
    
    getDanceScheduleDanceMoves(date, groupOfThePerson) {
        const list = app.listOfDanceSchedules;
        let result;
        list.forEach(element => {
            if (element.group === groupOfThePerson && element.date === date) {
                result = element.danceMoves;
            }
        });
        
        return result;
    },
    
    createDanceScheduleId() {
        const list = app.listOfDanceSchedules;
        result = list ? list.length : 0;
        return result;
    },
        
    createDanceSchedule(group, date, danceMoves) {
        const id = this.createDanceScheduleId();
        function CreateDanceSchedule(group, date, danceMoves, id) {
            this.group = group;
            this.date = date; 
            this.danceMoves = [danceMoves];
            this.id = id;
        }
        
        return new CreateDanceSchedule (group, date, danceMoves, id);
    },
    
    createNewMember(name, recommendedBy, startDate, group) {
        function Member(name, recommendedBy, startDate, group) {
            this.name = name;
            this.recommendedBy = recommendedBy;
            this.startDate = startDate;
            this.group = group;
            this.danceList = [];
        }
        
        return new Member(name, recommendedBy, startDate, group);
    },
    
    createAttendenceList(date) {
        function AttendenceList(date) {
            this.date = date;
            this.peopleList = [];
        }
        
        return new AttendenceList(date);
    }
       
};

const app = {
    listOfPeople: appStorage.listOfPeople.getListOfPeople() || [],
    danceList: appStorage.danceList.getDanceList() || [],
    listOfDanceSchedules: appStorage.listOfDanceSchedules.getListOfDanceSchedules() || [],
    attendanceList: appStorage.attendanceList.getAttendanceList() || []
};
