import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import AddEmployee from '@/Components/AddEmployee'

const inter = Inter({ subsets: ['latin'] })

const DEFAULT_EMPLOYEE_COST = 1000;
const DEFAULT_DEPENDENT_COST = 500;
const DISCOUNT_MULTIPLE = 0.9

export default function Home() {

  const [employee, setEmployee] = useState({});

  var benefitsCost = 0;

  function addEmployee(employee) {
    console.log("adding employee " + JSON.stringify(employee));

    setEmployee(employee);


  }

  function calculateBenefits(e) {
    e.preventDefault();

    var employeeCost = DEFAULT_EMPLOYEE_COST;
    employeeCost = calculateDiscount(employee, employeeCost);

    benefitsCost += employeeCost;
    console.log("Benefits cost : " + benefitsCost);

  }

  function calculateDiscount(person, cost) {
    if (person.firstName[0] === "A") {
      console.log("applying A discount ");
      return cost * 0.9;
    } else {
      return cost;
    }
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
            <h2>Employee Information</h2>
            <p>Please use the following form to enter employee information.</p>

            <AddEmployee onAddEmployee={addEmployee}></AddEmployee>

            <form>
              <div>
                <button onClick={calculateBenefits}>Calculate Benefits</button>
              </div>
            </form>
            <div>
              <h2>Dependent Information</h2>
              <p>Please use the following form to enter any optional dependents.</p>

            </div>
          </div>

          <div className={styles.content}>
            <h2>Benefits Cost</h2>

            {employee.firstName ? (
              <div>
                <p>Employee Name: {employee.firstName} {employee.lastName} Benefits Cost: {employeeCost} </p>
              </div>) : (
              <p>Benefits cost calculation will show here after employee info is entered.</p>
            )
            }
          </div>
        </div>

      </main>
    </>
  )
}

function calculateBenefits(event) {
  event.preventDefault();
  console.log(event);
}
