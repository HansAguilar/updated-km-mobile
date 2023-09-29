import { configureStore } from "@reduxjs/toolkit";
import patientReducer from '../reducer/PatientReducer';
import patientVerification from '../reducer/PatientVerificationReducer';
import appointmentReducer from '../reducer/AppointmentReducer';
import servicesReducer from '../reducer/ServicesReducer';
import dentistReducer from '../reducer/DentistReducer';
import announcementReducer from '../reducer/AnnouncementReducer';
import paymentReducer from '../reducer/PaymentReducer';
import installmentReducer from '../reducer/InstallmentReducer';
import messageReducer from '../reducer/MessageReducer';
import appointmentFeeReducer from '../reducer/AppointmentFeeReducer';
import scheduleReducer from '../reducer/ScheduleReducer';
import prescriptionReducer from '../reducer/PrescriptionReducer';

import thunk from 'redux-thunk';

export default configureStore({
  reducer: {
    patientVerification: patientVerification,
    patient: patientReducer,
    appointment: appointmentReducer,
    services: servicesReducer,
    dentist: dentistReducer,
    announcement:announcementReducer,
    payment: paymentReducer,
    installment: installmentReducer,
    messages:messageReducer,
    fee: appointmentFeeReducer,
    schedule:scheduleReducer,
    prescription: prescriptionReducer,
  },
  middleware:[thunk]
});
