import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patients', {
    state: () => ({ patients: [] }),
getters: {
        //! Property "never"
        getPatient: (state) => (id: number) => state.patients.find(patient => patient.id == id),
    },
    actions: {
      checkNewPatients(recievedData) {
        try {
            this.patients
            let jsonData = JSON.parse(recievedData)
        let patientsArray = JSON.parse(JSON.parse(jsonData).value)
        //console.log(patientsArray);
        let addFlag = true
        patientsArray.forEach(patient => {
            console.log(typeof patient.topic.replace('patients/',''));
            this.patients.forEach(person => {
                console.log(typeof person.id);
            });
            //! Entender o que se passa para adição excessiva dos pacientes
            console.log((this.patients.some(person => {
                JSON.parse(patient.topic.replace('patients/','')) === JSON.stringify(person.id)
            })));
            if (this.patients.some(person => {
                patient.topic.replace('patients/','') == person.id
            })) {
                console.log('AAAAAA');
                addFlag = false
            } else {
                console.log('BBBBBB');
            }

            if (addFlag) {
                this.patients.push({id: patient.topic.replace('patients/','')})
            }

            addFlag = true
        });
        } catch (error) {
            console.log('ERROR');
            console.error(error)
        }
      },
    },
})
