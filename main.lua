function factorial(n)
  if n == 0 then
    return 1
  else
    return n * factorial(n - 1)
  end
end

function main()
  print(teste)
  print(factorial(5) + factorial(6))
end

main()
