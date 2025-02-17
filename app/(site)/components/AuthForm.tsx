'use client'

import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '@/app/components/input/Input'
import Button from '@/app/components/button/Button'
import AuthSocialButton from './AuthSocialButton'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { fetcher } from '@/app/libs/fetcher'

type Variant = 'LOGIN' | 'REGISTER'
const AuthForm = () => {
  const session = useSession() // use Session check user login nextauth (Clientside).
  const router = useRouter() // use Router for navigation.
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users')
    }
  }, [session?.status])

  // Toggle between login and register
  const toggleVariant = useCallback(() => {
    setVariant((prevVariant) => (prevVariant === 'LOGIN' ? 'REGISTER' : 'LOGIN'))
  }, [])

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true)

    try {
      if (variant === 'REGISTER') {
        const responseData = await fetcher('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        toast.success(responseData.message || 'Đăng ký tài khoản thành công!')
        await signIn('credentials', data)
      } else if (variant === 'LOGIN') {
        const result = await signIn('credentials', { ...data, redirect: false })

        if (result?.error) {
          throw new Error('Sai tài khoản hoặc mật khẩu...')
        }

        toast.success('Đăng nhập thành công!')
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  // Login with google and github
  const socialAction = (action: string) => {
    setLoading(true)
    // Handle social login via NextAuth
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Không đăng nhập thành công!')
        }

        if (callback?.ok && !callback?.error) {
          toast.success('Đăng nhập thành công!')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white px-4 py-8 sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id='name'
              label='Name'
              register={register}
              errors={errors}
              disabled={loading}
              required={{ value: true, message: 'Name is required' }}
            />
          )}
          <Input
            id='email'
            label='Email address'
            type='email'
            register={register}
            errors={errors}
            disabled={loading}
            required={{ value: true, message: 'Email is required' }}
          />
          <Input
            id='password'
            label='Password'
            type='password'
            register={register}
            errors={errors}
            disabled={loading}
            required={{
              value: true,
              message: 'Password is required'
            }}
            minLength={{
              value: 6,
              message: 'Password must be at least 6 characters'
            }}
          />
          <div>
            <Button disabled={loading} fullWidth type='submit'>
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>Or continue with</span>
            </div>
          </div>
        </div>

        <div className='mt-6 gap-2 flex'>
          <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
          <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
        </div>

        <div className='mt-6 flex gap-2 justify-center text-sm px-2 text-gray-500'>
          <div>{variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}</div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
