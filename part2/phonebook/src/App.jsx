import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        showMessage('Failed to fetch data from server', 'error')
      })
  }, [])

  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    const personObject = {
      name: newName,
      number: newNumber
    }

    // 🔁 UPDATE EXISTING PERSON
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added. Replace old number?`
      )

      if (confirmUpdate) {
        personService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p =>
              p.id !== existingPerson.id ? p : returnedPerson
            ))

            showMessage(`Updated ${returnedPerson.name}`)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            const errorMessage =
              error.response?.data?.error ||
              `Information of ${existingPerson.name} has already been removed from server`

            showMessage(errorMessage, 'error')

            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }

    } else {
      // ➕ CREATE NEW PERSON
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))

          showMessage(`Added ${returnedPerson.name}`)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          const errorMessage =
            error.response?.data?.error || 'Failed to add person'

          showMessage(errorMessage, 'error')
        })
    }
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)

    const confirmDelete = window.confirm(
      `Delete ${person.name}?`
    )

    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`Deleted ${person.name}`)
        })
        .catch(error => {
          const errorMessage =
            error.response?.data?.error ||
            `Information of ${person.name} was already removed from server`

          showMessage(errorMessage, 'error')

          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h2>Numbers</h2>

      <Persons
        persons={persons}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App