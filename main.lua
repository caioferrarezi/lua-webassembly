function factorial(n)
  if n == 0 then
    return 1
  else
    return n * factorial(n - 1)
  end
end

function main()
  local html = ''

  html = html .. '<h1>'
  html = html .. 'Fatorial de 5: ' .. factorial(5)
  html = html .. '</h1>'

  html = html .. '<h2>'
  html = html .. 'Fatorial de 6: ' .. factorial(6)
  html = html .. '</h2>'

  return html
end
