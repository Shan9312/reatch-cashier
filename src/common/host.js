const httpBase = {
  dev: {
    mainWebsite: 'http://localhost:8002'
  },
  reachtest: {
    mainWebsite: 'https://admin.doooly.com/reachtest/dist/#/'
  },
  reach_dist: {
    mainWebsite: 'https://admin.doooly.com/reach_dist/dist/#/',
  },
  pre_cashier: {
    mainWebsite: 'https://reach-life.com/pre_dist/dist/#/'
  },
  pro_cashier: {
    mainWebsite: 'https://reach-life.com/pro_dist/dist/#/',
  }
}

// to detemine the environment by location href
const envArr = ['reachtest', 'reach_dist', 'pre_cashier', 'pro_cashier']
let Host = httpBase['dev']
if (document.location.protocol == 'https:') {
  envArr.map(item => {
    if (location.href.indexOf(item) > -1) {
      Host = httpBase[item]
    }
  })
}

export default Host