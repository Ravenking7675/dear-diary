N = int(input ( "Enter the number of Employees : " ))

lst = ()
i=0

arr = input('Enter the employee range : ')

lst = arr.split(' ')

print('Enter range of the employees ==> ')

l_range = int(input('Enter the Lower range : '))
u_range = int(input('Enter the Upper range : '))

for i in lst:

  if abs(int(i)) <= u_range and abs(int(i)) >= l_range:
    print(i, end=" ")
