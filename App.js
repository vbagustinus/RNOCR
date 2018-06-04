/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput
} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import axios from 'axios'
const window = Dimensions.get('window')
// More info on all the options is below in the README...just some common use cases shown here
let options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

export default class App extends Component<Props> {
  constructor(){
    super()
    this.state = {
      avatarSource: '',
      file: null,
      urlImage: '',
      modalVisible: false,
      hasilObject: false,
      nik: '',
      nama: '',
      agama: '',
      jenisKelamin: '',
      kewarganegaraan: '',
      kota : '',
      provinsi : '',
      status : '',
      tanggalLahir: '',
      tempatLahir: ''
    }
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  getPhoto = () =>{
    ImagePicker.showImagePicker(options, (response) => {    
      if (response.didCancel) {
        console.log('User cancelled image picker')
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      }
      else {
        console.log('Response = ', response)
        let image = {
          uri: response.uri,
          name: response.fileName,
          type: response.type
        }
        this.setState({
          avatarSource: response.uri,
          file: image
        })
      }
    })
  }
  sendToHell = async() => {
    this.setModalVisible(!this.state.modalVisible)
    console.log('SEND TO STORAGE')
    let { file }=  this.state
    if(file) {
      const data = new FormData()
      data.append('pageType', 'test-upload-api')
      data.append('file', file)
      const url = ''
      await axios.post(url, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      })
      .then( async({data}) => {
        console.log('HASIL UPLOAD',data['File URL'])
        const urlImage = data['File URL']
        if (urlImage) {
          await this.setState({
            urlImage: data['File URL']
          })
          await this.setModalVisible(!this.state.modalVisible)
          await Alert.alert('Berhasil di upload')
        } else {
          this.setModalVisible(!this.state.modalVisible)
          Alert.alert('Gagal di upload')
        }
      })
      .catch(err => {
        this.setModalVisible(!this.state.modalVisible)
        Alert.alert('Gagal di upload')
        console.log('KENA ERROR', err.response)
      })
    }
  }
  getSuggetsFromHell= async() => {
    this.setModalVisible(!this.state.modalVisible)
    let { urlImage }=  this.state
    if(urlImage !== ''){
      const url = ''
      await axios
        .post(url, { imageUri: urlImage })
        .then( async({data}) => {
          let ocr = data.object
          console.log('DATA OCR', ocr);
          
          await this.setModalVisible(!this.state.modalVisible)
          let { nik, nama, agama, jenisKelamin, kewarganegaraan, kota, provinsi, status, tanggalLahir, tempatLahir } = ocr
          await this.setState({
              hasilObject: true,
              nik: nik,
              nama: nama,
              agama: agama,
              jenisKelamin: jenisKelamin,
              kewarganegaraan: kewarganegaraan,
              kota : kota,
              provinsi : provinsi,
              status : status,
              tanggalLahir: tanggalLahir,
              tempatLahir: tempatLahir
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  render() {
    let { avatarSource, file, hasilObject, nik, nama, agama, jenisKelamin, kewarganegaraan, kota, provinsi , status, tanggalLahir, tempatLahir} = this.state
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.09)'
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </Modal>
        <Text style={styles.welcome}>
          OCR
        </Text>
        <Button
          onPress={() => this.getPhoto()}
          title={'Image'}
        />
        <ScrollView
           showsVerticalScrollIndicator={false}
        >
          <View style={styles.result}>
            {avatarSource !== '' ?
            <View>
            <Text>
              Result
            </Text>
              <Image
                source={{uri: avatarSource}}
                resizeMethod='resize'
                resizeMode= 'cover'
                style={{ width: window.width, height: window.width * 0.75, padding:0}}
              /> 
              <Button
                title='Upload'
                onPress={() => this.sendToHell()}
              /> 
              </View>: null
            }
          </View>
          {file ?
            <Button
              title='Get Suggestions'
              onPress={() => this.getSuggetsFromHell()}
            /> : null
          }
          { hasilObject ? 
            <View>
              <View>
                <Text>NIK</Text>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(nik) => this.setState({nik})}
                  value={nik}
                />
              </View>
              <View>
                <Text>Nama</Text>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(nama) => this.setState({nama})}
                  value={nama}
                />
              </View>
              <View>
                <Text>Agama</Text>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(agama) => this.setState({agama})}
                  value={agama}
                />
              </View>
            </View>
            : null
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    margin: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  result: {
    margin: 20,
  },
})
