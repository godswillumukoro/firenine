import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, serverTimestamp, getDoc, updateDoc
} from 'firebase/firestore'

import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDXrTUEsLplLlAPxFqXmylJHF7ITVTWkEY",
    authDomain: "fire-nine-a06c4.firebaseapp.com",
    projectId: "fire-nine-a06c4",
    storageBucket: "fire-nine-a06c4.appspot.com",
    messagingSenderId: "868081463160",
    appId: "1:868081463160:web:8cc38e2abe1d53ad08e28d"
}

// Intialize the firestore service
initializeApp(firebaseConfig)
const myDatabase = getFirestore()
const auth = getAuth()

// Collection and DB reference
const collectionReference = collection(myDatabase, 'books')

// quering db
// const q = query(collectionReference, where('author', '==', 'Chimamanda Adichie'), orderBy('createdAt', 'asc'))
const q = query(collectionReference, orderBy('createdAt', 'asc'))

// Retrieve all documents inside a collection
// getDocs(collectionReference)
//     .then((snapshot) => {
//         let books = []
//         snapshot.docs.forEach((doc) => {
//             books.push({ ...doc.data(), id: doc.id })
//         })
//         console.log(books)
//     })
//     .catch((err) => {
//         console.error(err.message)
//     })

// Real-time listener. runs everytime there is a change in the collection
const unsubCollection = onSnapshot(q, (snap) => {
    let books = []
    snap.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
})

// custom form handling
const addBook = document.querySelector('.add-books')
addBook.addEventListener('submit', (event) => {
    event.preventDefault()
    addDoc(collectionReference, {
        title: addBook.title.value,
        author: addBook.author.value,
        createdAt: serverTimestamp()
    })
        .then(() => {
            addBook.reset()
        })
})

const deleteBook = document.querySelector('.del-books')
deleteBook.addEventListener('submit', (event) => {
    event.preventDefault()

    const documentReference = doc(myDatabase, 'books', deleteBook.id.value)
    deleteDoc(documentReference) //deletes the document
        .then(() => {
            deleteBook.reset() //resets the form
        })
})

const updateBook = document.querySelector('.update-book')
updateBook.addEventListener('submit', (event) => {
    event.preventDefault()

    // update a single document
    const documentReference = doc(myDatabase, 'books', updateBook.id.value)
    updateDoc(documentReference, {
        title: 'UPDATED'
    })
        .then(() => {
            updateBook.reset()
        })

})

const documentReference = doc(myDatabase, 'books', 'iWCPJ6GieEOVjWTQc8sD')
// getDoc(documentReference)
//     .then(doc => {
//         console.log(doc.data(), doc.id)
//     })

// real-time listener
// onSnapshot(documentReference, (doc) => {
//     console.log(doc.data(), doc.id)
// })

// Auth
// signup
const signup = document.querySelector('.signup')
signup.addEventListener('submit', (event) => {
    event.preventDefault()

    const email = signup.email.value
    const password = signup.password.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((credential) => {
            // console.log('user created:', credential.user)
            signup.reset()
        })
        .catch((error) => {
            console.error(error.message)
        })
})

// login
const login = document.querySelector('.login')
login.addEventListener('submit', (event) => {
    event.preventDefault()

    const email = login.email.value
    const password = login.password.value
    signInWithEmailAndPassword(auth, email, password)
        .then((credential) => {
            // console.log('user logged in:', credential.user)
            signup.reset()
        })
        .catch(error => {
            console.error(error.message)
        })
})


// logout
const logout = document.querySelector('.logout')
logout.addEventListener('click', (event) => {
    signOut(auth)
        .then(() => {
            // console.log('Signed out');
        })
        .catch((error) => {
            console.error(error)
        })
})

// auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('status:', user)
})

// unsubscribing from realtime functions by calling the returned funcs
const unsub = document.querySelector('.unsub')
unsub.addEventListener('click', () => {
    console.log('unsubscribed')
    unsubCollection()
    unsubAuth()
})