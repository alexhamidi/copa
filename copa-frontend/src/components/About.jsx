import React from 'react'

export default function About() {
  return (
    <div className='page'>
        <header className = 'title'> About this site </header> 
        <section className = 'text'>
            <p> 
                This webpage is a supplemental site to the research done by Ricardo Sanchez, Megan Riddle, Jongwook Woo, and Jamil Momand in their 2008 paper titled: 'Prediction of reversibly oxidized protein cysteine thiols
                using protein structure properties' (Protein Sci. 2008 17: 473-481). 

                The Oxidation Susceptible Cysteine Thiol Database (OSCTdb) and Balanced Oxidation Susceptible Cysteine Thiol database (BALOSCTdb)
                are both hosted on this site, with funtionalities for viewing different parameters and downloading datasets. 
                
                Furthermore, the Cysteine Oxidation Prediction Algorithm (COPA) is a machine-learning algorithm hosted on this site
                that is capable of predicting whether or not an oxidation susceptible protein thiol is reversibly oxidizing. It offers text inputs and file inputs. 
            </p>
        </section>
    </div>
  )
}
