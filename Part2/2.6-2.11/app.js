import React, { useEffect, useState } from 'react'
import axios from 'axios'
 

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterPerson, setFilterPerson ] = useState([...persons])
  const [ showAll, setShowAll ] = useState(true)

  useEffect(()=>{
        axios
        .get('http://localhost:3001/persons')
        .then(response => {
          const person = response.data
          setPersons(person)
        })
  },[])

  const addPerson = (event)=>{
    event.preventDefault();
    const personObject = {name: newName, number: newNumber}

    let validarPerson = persons.filter(person=>(person.name === personObject.name))
    if(validarPerson.length > 0){
      alert(`${newName} is already added to phonebook`)
      persons.pop()
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
    setShowAll(true)
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
  
  const contactToShow = showAll ? persons : filterPerson

  return (
    <div>
      <h2>Phonebook</h2>
      <DivFilter 
        name={'filter shown with'}
        onChange={handleFilter}
      />
      <h2>Add a new</h2>
      <PersonsForm 
        add={addPerson}
        valueName={newName}
        onChangeName={handleNameChange}
        valueNumber={newNumber}
        onChangeNumber={handleNumberChange} 
      />
      <h2>Numbers</h2>
        <Persons contacts={contactToShow} />
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

const Persons =({contacts})=>{
  const constact = contacts
  return  <ul>
            {constact.map(
                (person,index) =>(
                  <li key={index}>{person.name} {person.number}</li>
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

export default App
