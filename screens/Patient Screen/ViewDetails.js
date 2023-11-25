import React, { useState } from 'react';
import { View, Text, Image,Dimensions,Pressable,ScrollView,TextInput,Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from "../../style/styles";
import EntypoIcon from 'react-native-vector-icons/Entypo';
import InputText from '../../components/InputText';
import Toast from 'react-native-toast-message';
import ToastFunction from "../../config/toastConfig";
import * as ImagePicker from 'expo-image-picker';
import { updatePatientInfo } from "../../redux/action/PatientAction";

function ViewDetails({navigation}) {
    const { width, height } = Dimensions.get("screen");
    const {patient} = useSelector((state)=>{ return state.patient; });
    const [data, setData] = useState({
        profile:  patient.profile,
        firstname:  patient.firstname,
        middlename:  patient.middlename,
        lastname:  patient.lastname,
        address: patient.address,
        contactNumber: patient.contactNumber,
        email: patient.email,
        password:"",
    });
    const [modal, setModal] = useState(false);
    const dispatch = useDispatch();

    const onChangeText = (name, value) => {
        setData({ ...data, [name]: value });
      };

      const handleImageUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (result.canceled) {
          return ToastFunction("error", "Kindly select an image");
        }
      
        const selectedAsset = result.assets[0];
        const base64Image = await convertAssetToBase64(selectedAsset);
        setData({...data, profile:base64Image});
      };

      const convertAssetToBase64 = async (asset) => {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

    const submitButton =()=>{
        if(!data.firstname || !data.lastname || !data.address || !data.contactNumber || !data.email){
            return Alert.alert("Fill empty field!");
        }
        if (/[^\w\s]/.test(data.fullname)) {
            return Alert.alert("Invalid characters for fullname!");
        }
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data.email)) {
            return Alert.alert("Invalid email!");
        }
        const regex = /^09\d{9}$/;
        if(!regex.test(data.contactNumber)){
            return Alert.alert("Contact number must be 11-digit and must start with 09");
        }
        dispatch(updatePatientInfo(patient.patientId, data));
        navigation.navigate("Dashboard");
    }

    const cancelButton = () =>{
        navigation.navigate("Dashboard");
    }



    const ChangePasswordModal = () =>{
        const[passwordInfo, setPasswordInfo] = useState({
            password: "",
            confirmPassword:""
        });
        const [isSecure, setSecure] = useState({
            password: true,
            confirmPassword: true
        });

        const onChangePassword = (name, value) => {
            setPasswordInfo({ ...passwordInfo, [name]: value });
          };
        
        const submitPassword=()=>{
            if(!passwordInfo.confirmPassword || !passwordInfo.password){
                return Alert.alert("Fill up empty field!");
            }
            if(passwordInfo.password !== passwordInfo.confirmPassword){
                return Alert.alert("Mismatch password and confirmPassword!");
            }
            setData({...data, password:passwordInfo.password});
            setModal(false);
        }
        return (
        <View  style={{height:"100%", width:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)", position:'absolute',zIndex:10,padding:20, display:'flex', justifyContent:'center', alignItems:'center'}}>
            <View style={{ width:"100%",height:"auto",maxHeight:600,  backgroundColor:"white",padding:20,borderRadius:10,zIndex:-10}}>
                <Text style={{fontSize:24, marginBottom:10}}>Change New Password</Text>
                {/* password */}
                <View style={{width:"100%",marginTop:10}}>
                    <Text style={{fontSize:12, marginBottom:5}}>Password</Text>
                    <InputText
                        onChangeText={onChangePassword}
                        name="password"
                        value={passwordInfo.password}
                        isSecure={isSecure.password}
                        iconName={isSecure.password ? 'eye-with-line' : 'eye'}
                        iconFunction={() => setSecure({...isSecure, password:!isSecure.password})}
                        iconColor="#4b5563"
                    />
                </View>

                {/* confirm password */}
                <View style={{width:"100%",marginTop:10}}>
                    <Text style={{fontSize:12, marginBottom:5}}>Confirm Password</Text>
                    <InputText
                        onChangeText={onChangePassword}
                        name="confirmPassword"
                        value={passwordInfo.confirmPassword}
                        isSecure={isSecure.confirmPassword}
                        iconName={isSecure.confirmPassword ? 'eye-with-line' : 'eye'}
                        iconFunction={() => setSecure({...isSecure, confirmPassword:!isSecure.confirmPassword})}
                        iconColor="#4b5563"
                    />
                </View>
                <View style={{width:"100%", display:'flex', flexDirection:'row',gap:10, marginTop:10}}>
                    <Text style={{flex:1, paddingVertical:10, paddingHorizontal:15,textAlign:'center',backgroundColor: "#ef4444",color:"#fff", borderRadius:10}} onPress={()=>setModal(false)}>Cancel</Text>
                    <Text style={{flex:1, paddingVertical:10, paddingHorizontal:15,textAlign:'center',backgroundColor: "#06b6d4",color:"#fff", borderRadius:10}} onPress={submitPassword}>Submit</Text>
                </View>
            </View>
        </View>
        )
    }

    return patient && (
      <>
      {modal && <ChangePasswordModal />}
      <View style={{...styles.containerGray,height:height, width:width,position:'relative',padding:20}}>
        <Toast />
        <Text style={{fontSize:18, fontWeight:'bold', marginBottom:10, textTransform:'capitalize'}}>Update Profile</Text>
        <ScrollView contentContainerStyle={{width:"100%", paddingBottom:20, display:'flex', justifyContent:'center', alignItems:'center',zIndex:-10}} >
           
            {/* IMAGE */}
            <View>
                <Image source={{uri:data.profile}} style={{width:120, height:120, borderRadius:100}} />
                <Text style={{textAlign:'center', color:"#06b6d4", fontWeight:'bold', textDecorationLine:'underline',marginTop:5}} onPress={handleImageUpload}>Edit</Text>
                <Text style={{textAlign:'center', color:"#06b6d4", fontWeight:'bold', textDecorationLine:'underline',marginTop:5}} onPress={()=>navigation.navigate("HMO")}>Add HMO</Text>
            </View>
            
            {/* Firstname */}
            <View style={{width:"100%",marginTop:10}}>
                <Text style={{fontSize:12, marginBottom:5}}>Fullname</Text>
                <InputText
                    onChangeText={onChangeText}
                    name="firstname"
                    value={data.firstname}
                />
            </View>
            <View style={{width:"100%",marginTop:10}}>
                <Text style={{fontSize:12, marginBottom:5}}>Fullname</Text>
                <InputText
                    onChangeText={onChangeText}
                    name="middlename"
                    value={data.middlename}
                />
            </View>
            <View style={{width:"100%",marginTop:10}}>
                <Text style={{fontSize:12, marginBottom:5}}>Fullname</Text>
                <InputText
                    onChangeText={onChangeText}
                    name="lastname"
                    value={data.lastname}
                />
            </View>

            {/* Address */}
            <View style={{width:"100%",marginTop:10}}>
                <Text style={{fontSize:12, marginBottom:5}}>Address</Text>
                <InputText
                    onChangeText={onChangeText}
                    name="address"
                    value={data.address}
                />
            </View>

            {/* Contact Number */}
            <View style={{width:"100%",marginTop:10}}>
                <Text style={{fontSize:12, marginBottom:5}}>Contact Number</Text>
                <InputText
                    onChangeText={onChangeText}
                    name="contactNumber"
                    value={data.contactNumber}
                />
            </View>

             {/* Email */}
             <View style={{width:"100%",marginTop:10}}>
                <Text style={{fontSize:12, marginBottom:5}}>Email</Text>
                <InputText
                    onChangeText={onChangeText}
                    name="email"
                    value={data.email}
                />
            </View>
            {
                !data.password && (<Text style={{ width:"100%",paddingVertical:10, color:"#06b6d4", fontWeight:'bold', textDecorationLine:'underline',marginTop:5}} onPress={()=>setModal(true)}>Change password?</Text>)
            }
            {
                data.password && (
                    <View style={{width:"100%",marginTop:10}}>
                        <Text style={{fontSize:12, marginBottom:5}}>Password</Text>
                        <InputText
                            name="password"
                            value={data.password}
                            isSecure={true}
                            isEditable={false}
                            iconColor="#4b5563"
                        />
                    </View>
                )
            }

            
            <View style={{width:"100%", display:'flex', flexDirection:'row',gap:10, marginTop:10}}>
            <Text style={{flex:1, paddingVertical:10, paddingHorizontal:15,textAlign:'center',backgroundColor: "#ef4444",color:"#fff", borderRadius:10}} onPress={cancelButton}>Cancel</Text>
            <Text style={{flex:1, paddingVertical:10, paddingHorizontal:15,textAlign:'center',backgroundColor: "#06b6d4",color:"#fff", borderRadius:10}} onPress={submitButton}>Submit</Text>
        </View>
        </ScrollView>
        
      </View>
      </>
    )
}

export default ViewDetails