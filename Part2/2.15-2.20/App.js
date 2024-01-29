import React, { useEffect, useState } from 'react'
import contactServices from './services/contacts'
import './index.css'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterPerson, setFilterPerson ] = useState([...persons])
  const [ showAll, setShowAll ] = useState(true)
  const [ copyPerson, setCopyPerson ] = useState([...persons])
  const [ message, setMessage ] = useState(null)
  const contactToShow = showAll ? persons : filterPerson

  useEffect(()=>{
        contactServices
        .getAll()
        .then(person => setPersons(person)
        )
  },[],[newNumber])


  const addPerson = (event)=>{
    event.preventDefault();
    const personObject = {name: newName, number: newNumber}

    let validarPerson = persons.filter(person=>(person.name === personObject.name))
    if(validarPerson.length > 0){
      // eslint-disable-next-line no-restricted-globals
      if(confirm(`${newName} is already added to phonebook, want you edit this contact?`)){
        let updatePerson = persons.filter(person => person.name === personObject.name)
        
        contactServices
          .update(updatePerson[0].id, personObject)
          .catch(error => {
            setMessage(
              <p className='messageError'>{newName} name contact non fund</p>
            )
            setTimeout(()=>{
              setMessage(null)
            }, 2000)
          })
      } else{
        setPersons(persons)
      }
    } else {
      setPersons(persons.concat(personObject))

      contactServices
          .create(personObject)
          .then(personAdd => {
              setPersons(persons.concat(personAdd))})
          .then(
            setMessage(
              <p className='messageAdd'>You've adeed to {newName}</p>
            ),
            setTimeout(()=>{
              setMessage(null)
            }, 2000)
          )    
          ;  
    }

    setNewName('')
    setNewNumber('')
    setShowAll(true)
    setCopyPerson(persons)
  }
  const handleNameChange =(event)=>{
    setNewName(event.target.value)
  }
  const handleNumberChange =(event)=>{
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setFilterPerson(
        persons.filter(person => (
            person.name.toUpperCase().includes(event.target.value.toUpperCase())
        ))
    )
    setShowAll(false)
  }

  const onDelete =(e)=>{
    let targetChild = e.target.parentNode
    
    let deleteThis = persons.filter(person =>(
      targetChild.innerText.includes(person.name)
  ))
   
    contactServices
        .deleteContact(deleteThis[0].id)

    setCopyPerson(persons)    
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <DivFilter 
        name={'filter shown with'}
        onChange={handleFilter}
      />
      <h2>Add a new</h2>
      <Notification message={message}/>
      <PersonsForm 
        add={addPerson}
        valueName={newName}
        onChangeName={handleNameChange}
        valueNumber={newNumber}
        onChangeNumber={handleNumberChange} 
      />
      <h2>Numbers</h2>
        <Persons contacts={contactToShow} onDelete={onDelete} />
    </div>
  )
}

const PersonsForm =({add, valueName, onChangeName, valueNumber, onChangeNumber})=>{
  return <form onSubmit={add}>
            <DivImput 
              name={'name'} 
              value={valueName} 
              onChange={onChangeName} 
            />
            <DivImput 
              name={'number'} 
              value={valueNumber} 
              onChange={onChangeNumber} 
            />
            <div>
              <button type="submit">add</button>
            </div>
          </form>
}

const Persons =({contacts, onDelete})=>{
  const constact = contacts
  return  <ul>
            {constact.map(
                (person,index) =>(
                    <li key={index}>
                        {person.name} {person.number}
                        <button onClick={onDelete}>delete</button>
                    </li>
                )
            )}
          </ul>
}

const DivFilter =({name, onChange})=>{
  return <div>
     {name} <input onChange={onChange}/>
   </div> 
}

const DivImput = ({value, onChange, name})=>{
  return <div>
          {name}: <input
                  value={value}
                  onChange={onChange} />
         </div>
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  } else {
    return (
      <div>
        {message}
      </div>
    )
  }

}

export default App
