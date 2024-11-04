import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patients', {
    state: () => ({ patients: [] }),
getters: {
        //! Property "never"
        getPatient: (state) => (id: number) => state.patients.find(patient => patient.id == id),
    },
    actions: {
      
    },
})
