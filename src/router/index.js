import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/Welcome')
const Users = () => import('views/user/Users')
const Rights = () => import('views/rights/Rights')
const Roles = () => import('views/role/Roles')
const Caterogy = () => import('views/goods/Category')

const routes = [
  // 登录
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // 主页
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', name: 'Welcome', component: Welcome},
      {path: '/users', name: 'Users', component: Users},
      {path: '/rights', name: 'Rights', component: Rights},
      {path: '/roles', name: 'Roles', component: Roles},
      {path: '/categories', name: 'Category', component: Caterogy}
    ]
  },
  {
    path: '/',
    redirect: 'Login'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()

  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')

  next()
})

export default router
