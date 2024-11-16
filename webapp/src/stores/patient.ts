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
        console.log(patientsArray);
        patientsArray.forEach(patient => {
            const patientId = JSON.parse(JSON.stringify(+patient.topic.replace('patients/', '')))
            console.log(patientId);
            console.log(this.getPatient(patientId));
            
            if (this.getPatient(patientId) == undefined){
                console.log('Unexistent patient :(');
                this.patients.push(
                    {
                        id: patientId,
                        heartRate: [JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random1],
                        glycemicLevels: [JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random2],
                        arterialPressure: [JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random3],
                        bodyTemperature: [JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random1],
                        respiratoryRate: [JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random2],
                        oxygenSaturation: [JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random3],
                    }
                )
            } else {
                console.log('Existant patient :)');
                const patientToMod = this.getPatient(patientId)
                patientToMod.heartRate.push(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random1);
                patientToMod.glycemicLevels.push(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random2);
                patientToMod.arterialPressure.push(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random3);
                patientToMod.bodyTemperature.push(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random1);
                patientToMod.respiratoryRate.push(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random2);
                patientToMod.oxygenSaturation.push(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(patient.value)))).random3);
            }
        });
        } catch (error) {
            console.log('ERROR');
            console.error(error)
        }
      },
    },
})
