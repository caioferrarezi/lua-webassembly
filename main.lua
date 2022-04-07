function factorial(n)
  if n == 0 then
    return 1
  else
    return n * factorial(n - 1)
  end
end

return "From Lua: " .. (factorial(5) + factorial(6))
