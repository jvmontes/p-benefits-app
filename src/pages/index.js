import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import AddPerson from '@/Components/AddPerson'
import { v4 as uuid } from 'uuid';

const inter = Inter({ subsets: ['latin'] })

const DEFAULT_EMPLOYEE_COST = 1000;
const DEFAULT_DEPENDENT_COST = 500;
const DISCOUNT_MULTIPLE = 0.9

export default function Home() {

  const [employee, setEmployee] = useState({});
  const [dependents, setDependents] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  function addEmployee(e) {
    setEmployee(e);
  }

  function addDependent(d) {
    const unique_id = uuid();
    d.key = unique_id.slice(0,8)
    setDependents([...dependents, d]);
  }

  function calculateDiscount(person, cost) {
    return (person.firstName[0] === "A" || person.firstName[0] === "a") ? cost * DISCOUNT_MULTIPLE : cost;
  }

  function calculateBenefits(event) {
    event.preventDefault();

    setTotalCost(0);

    if (employee.firstName !== undefined) {
      var calculatedEmployeeCost = calculateDiscount(employee, DEFAULT_EMPLOYEE_COST);
      setEmployee({
        firstName: employee.firstName,
        lastName: employee.lastName,
        cost: calculatedEmployeeCost
      });
      setTotalCost(prevTotalCost => prevTotalCost + calculatedEmployeeCost);
    }

    setDependents(
      dependents.map((dependent) => {
        var calculatedDependentCost = calculateDiscount(dependent, DEFAULT_DEPENDENT_COST);
        setTotalCost(prevTotalCost => prevTotalCost + calculatedDependentCost);
        return {...dependent, cost: calculatedDependentCost};
      })
    )
  }

  return (
    <>
      <Head>
        <title>Benefits Calculator</title>
        <meta name="description" content="Calculate employee benefits cost" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

        <div className={styles.header}>
          <h1>Benefits Calculator</h1>
          <p>This web application is intended to input employees and their dependents and get a preview of the costs.</p>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <div>
              <h2>Employee Information</h2>
              <p>Please use the following form to enter employee information.</p>
              <AddPerson onAddPerson={addEmployee} actionButtonText="Add Employee"></AddPerson>
            </div>

            <div>
              <h2>Dependent Information</h2>
              <p>Please use the following form to enter any optional dependents.</p>
              <AddPerson onAddPerson={addDependent} actionButtonText="Add Dependent"></AddPerson>
            </div>

            <form>
              <div>
                <button onClick={calculateBenefits}>Calculate Benefits</button>
              </div>
            </form>

          </div>

          <div className={styles.content}>
            <h2>Benefits Cost</h2>

            {employee.firstName ?
              (
                <div>
                  <p>Total Cost: {totalCost}</p>
                  <p>Employee Name: {employee.firstName} {employee.lastName} {employee.cost && (<span>Benefits Cost: {employee.cost}</span>)}</p>
                  {
                    dependents.length > 0 && 
                    (
                      <>
                      {dependents.map((dependent) => (
                        <p key={dependent.key}>Dependent Name: {dependent.firstName} {dependent.lastName} {dependent.cost && (<span>Benefits Cost: {dependent.cost}</span>)} </p>
                      ))}
                      </>
                    )
                  }
                </div>) :
              (
                <p>Benefits cost calculation will show here after employee info is entered.</p>
              )
            }
          </div>
        </div>

      </main>
    </>
  )
}
