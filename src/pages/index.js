import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import AddPerson from '@/Components/AddPerson'
import { v4 as uuid } from 'uuid';
import { FaMinusSquare } from 'react-icons/fa'

const DEFAULT_EMPLOYEE_COST = 1000;
const DEFAULT_DEPENDENT_COST = 500;
const DISCOUNT_MULTIPLE = 0.9
const EMPLOYEE_PAY_PER_PAYCHECK = 2000;
const EMPLOYEE_PAYCHECKS_PER_YEAR = 26;

export default function Home() {

  const [employee, setEmployee] = useState({});
  const [dependents, setDependents] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const grossAnnualPay = (EMPLOYEE_PAY_PER_PAYCHECK * EMPLOYEE_PAYCHECKS_PER_YEAR) - totalCost;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const onClearInfo = (e) => {
    e.preventDefault();
    setTotalCost(0);
    setEmployee({});
    setDependents([]);
  }

  function addEmployee(e) {
    var calculatedEmployeeCost = calculateDiscount(e, DEFAULT_EMPLOYEE_COST);
    setEmployee({
      firstName: e.firstName,
      lastName: e.lastName,
      cost: calculatedEmployeeCost
    });

    setTotalCost(0);
    setTotalCost(prevTotalCost => prevTotalCost + calculatedEmployeeCost);
    dependents.map((dependent) => {
      setTotalCost(prevTotalCost => prevTotalCost + dependent.cost);
    })
  }

  function addDependent(d) {
    const unique_id = uuid();
    d.key = unique_id.slice(0, 8);
    d.cost = calculateDiscount(d, DEFAULT_DEPENDENT_COST);

    setTotalCost(prevTotalCost => prevTotalCost + d.cost);
    setDependents([...dependents, d]);
  }

  function onRemoveDependent(key) {
    var dependentToRemove = dependents.find(dependent => dependent.key === key);
    setTotalCost(prevTotalCost => prevTotalCost - dependentToRemove.cost);
    setDependents(dependents.filter((dependent) => dependent.key !== key));
  }

  function calculateDiscount(person, cost) {
    return (person.firstName[0] === "A" || person.firstName[0] === "a") ? cost * DISCOUNT_MULTIPLE : cost;
  }

  function truncateIfNecessary(string) {
    if (string.length > 10) {
      var truncated = string.slice(0, 9);
      truncated = truncated + "..";
      return truncated;
    } else {
      return string;
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
            <div>
              <h2>Employee Information</h2>
              <p>Please use the following form to enter employee information.</p>
              <AddPerson onAddPerson={addEmployee} actionButtonText="Add Employee"></AddPerson>
            </div>

            {employee.firstName && (
              <div>
                <h2>Dependent Information</h2>
                <p>Please use the following form to enter any optional dependents.</p>
                <AddPerson onAddPerson={addDependent} actionButtonText="Add Dependent"></AddPerson>
              </div>
            )}
          </div>

          <div className={styles.content}>
            <h2>Compensation Overview</h2>
            {employee.firstName ?
              (
                <div>
                  <div className={styles.resultsCard}>
                    <div>Net Annual Pay:</div>
                    <div>{formatter.format(EMPLOYEE_PAY_PER_PAYCHECK * EMPLOYEE_PAYCHECKS_PER_YEAR)}</div>
                  </div>
                  <div className={styles.resultsCard}>
                    <div>Total Annual Benefits Deduction:</div>
                    <div>{formatter.format(totalCost)}</div>
                  </div>
                  <div className={styles.resultsCard}>
                    <div>Gross Annual Pay:</div>
                    <div>{formatter.format(grossAnnualPay)}</div>
                  </div>
                  <div className={styles.resultsCard}>
                    <div>Gross Paycheck Amount:</div>
                    <div>{formatter.format(grossAnnualPay / EMPLOYEE_PAYCHECKS_PER_YEAR)}</div>
                  </div>
                  <div className={styles.resultsCard}>
                    <div>Paycheck Deduction Amount:</div>
                    <div>{formatter.format(EMPLOYEE_PAY_PER_PAYCHECK - (grossAnnualPay / EMPLOYEE_PAYCHECKS_PER_YEAR))}</div>
                  </div>
                  <div>
                    <h3>Employee Info</h3>
                    <div className={styles.resultsCard}>
                      <div><em><u>Name</u></em></div>
                      <div><em><u>Annual Deduction</u></em></div>
                    </div>
                    <div className={styles.resultsCard}>
                      <div>
                        {truncateIfNecessary(employee.firstName)} {truncateIfNecessary(employee.lastName)}
                      </div>
                      {employee.cost && (<div>{formatter.format(employee.cost)}</div>)}
                    </div>
                  </div>

                  {
                    dependents.length > 0 &&
                    (
                      <div>
                        <h3>Dependent(s) Info</h3>
                        <div className={styles.resultsCard}>
                          <div><em><u>Name</u></em></div>
                          <div><em><u>Annual Deduction</u></em></div>
                        </div>
                        {dependents.map((dependent) => (
                          <div key={dependent.key} className={styles.resultsCard}>
                            <div>
                              <FaMinusSquare style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => onRemoveDependent(dependent.key)}></FaMinusSquare>
                              {truncateIfNecessary(dependent.firstName)} {truncateIfNecessary(dependent.lastName)}
                            </div>
                            {dependent.cost && (<div>{formatter.format(dependent.cost)}</div>)}
                          </div>

                        ))}
                      </div>
                    )
                  }
                  <form>
                    <div>
                      <button className={styles.redButton} onClick={onClearInfo}>Clear Info</button>
                    </div>
                  </form>

                </div>) :
              (
                <p>A detailed compensation overview will show here after employee info is entered.</p>
              )
            }
          </div>
        </div>

      </main>
    </>
  )
}
