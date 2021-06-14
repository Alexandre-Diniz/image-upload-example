import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Platform, Button, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

const app = firebase.app()

export default function App() {

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      base64: true
    })

    if (!result.cancelled) {
      const file = String(result.uri).split('/ImagePicker/')[1]
      const id = file.split('.')[0]
      const format = file.split('.')[1]
      uploadImage(result.uri, id)
        .then(()=>{
          Alert.alert('imagem carregada')
        })
    }
  }

  const uploadImage = async (uri, id) => {
    try {
      const result = await fetch(uri)
      const blob = await result.blob()
      const response = await app.storage().ref(id).put(blob)
      console.log('response: ', response)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button title="upload image" onPress={pickImage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
