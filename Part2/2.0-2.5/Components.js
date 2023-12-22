const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>

const Content = ({ course }) => {
  const parts = course.parts

  return <>
    {parts.map(part => (
      <Part 
        key={part.id} 
        name={part.name} 
        exercises={part.exercises}
      />
    ))}     
  </>
}

const Total =({ course })=>{
  const parts = course.parts

  const total = parts.reduce((sum, part) => {
    return sum + part.exercises
  }, 0)

  return <>
    <p><strong>total of {total} exercises</strong></p>
  </>
}

const Course =({ course })=>{
  const h1 = course.name

  return <>
    <Header course={h1}/>
    <Content course={course}/>
    <Total course={course}/>
  </>
}

export default Course
