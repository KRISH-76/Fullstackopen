import Course from './Course'

const App = () => {
  const courses = [
    {
      name: "Math",
      id: 1,
      parts: [
        { name: "Algebra", exercises: 5, id: 1 },
        { name: "Geometry", exercises: 3, id: 2 }
      ]
    },
    {
      name: "ADS",
      id: 2,
      parts: [
        { name: "Sorting", exercises: 7, id: 1 },
        { name: "Graphs", exercises: 4, id: 2 }
      ]
    }
  ]

  return (
    <div>
      {courses.map(course =>
        <Course key={course.id} course={course} />
      )}
    </div>
  )
}

export default App
