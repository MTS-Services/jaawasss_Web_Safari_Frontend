export interface Country {
  code: string
  name: string
  region: string
  subregion?: string
  featured?: boolean
  flag: string
}

// Helper function to convert country code to flag emoji
export function getCountryFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export const countries: Country[] = [
  // Africa (54 countries)
  { code: "DZ", name: "Algeria", region: "Africa", subregion: "Northern Africa", flag: "🇩🇿" },
  { code: "AO", name: "Angola", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇦🇴" },
  { code: "BJ", name: "Benin", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇧🇯" },
  { code: "BW", name: "Botswana", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇧🇼" },
  { code: "BF", name: "Burkina Faso", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇧🇮" },
  { code: "CV", name: "Cabo Verde", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇨🇻" },
  { code: "CM", name: "Cameroon", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇨🇲" },
  { code: "CF", name: "Central African Republic", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇨🇫" },
  { code: "TD", name: "Chad", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇹🇩" },
  { code: "KM", name: "Comoros", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇰🇲" },
  { code: "CG", name: "Congo", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇨🇬" },
  { code: "CD", name: "Congo (Democratic Republic)", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇨🇩" },
  { code: "CI", name: "Cote d'Ivoire", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇨🇮" },
  { code: "DJ", name: "Djibouti", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇩🇯" },
  { code: "EG", name: "Egypt", region: "Africa", subregion: "Northern Africa", flag: "🇪🇬" },
  { code: "GQ", name: "Equatorial Guinea", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇪🇷" },
  { code: "SZ", name: "Eswatini", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇸🇿" },
  { code: "ET", name: "Ethiopia", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇪🇹" },
  { code: "GA", name: "Gabon", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇬🇲" },
  { code: "GH", name: "Ghana", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇬🇭" },
  { code: "GN", name: "Guinea", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇬🇼" },
  { code: "KE", name: "Kenya", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇰🇪" },
  { code: "LS", name: "Lesotho", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇱🇷" },
  { code: "LY", name: "Libya", region: "Africa", subregion: "Northern Africa", flag: "🇱🇾" },
  { code: "MG", name: "Madagascar", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇲🇼" },
  { code: "ML", name: "Mali", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇲🇱" },
  { code: "MR", name: "Mauritania", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇲🇷" },
  { code: "MU", name: "Mauritius", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇲🇺" },
  { code: "MA", name: "Morocco", region: "Africa", subregion: "Northern Africa", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇲🇿" },
  { code: "NA", name: "Namibia", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇳🇦" },
  { code: "NE", name: "Niger", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇳🇬" },
  { code: "RW", name: "Rwanda", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇷🇼" },
  { code: "ST", name: "Sao Tome and Principe", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇸🇹" },
  { code: "SN", name: "Senegal", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇸🇳" },
  { code: "SC", name: "Seychelles", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇸🇱" },
  { code: "SO", name: "Somalia", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇸🇴" },
  { code: "ZA", name: "South Africa", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇿🇦" },
  { code: "SS", name: "South Sudan", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇸🇸" },
  { code: "SD", name: "Sudan", region: "Africa", subregion: "Northern Africa", flag: "🇸🇩" },
  { code: "TZ", name: "Tanzania", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇹🇿" },
  { code: "TG", name: "Togo", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇹🇬" },
  { code: "TN", name: "Tunisia", region: "Africa", subregion: "Northern Africa", flag: "🇹🇳" },
  { code: "UG", name: "Uganda", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇺🇬" },
  { code: "ZM", name: "Zambia", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", region: "Africa", subregion: "Sub-Saharan Africa", flag: "🇿🇼" },

  // Americas (35 countries)
  { code: "AG", name: "Antigua and Barbuda", region: "Americas", subregion: "Caribbean", flag: "🇦🇬" },
  { code: "AR", name: "Argentina", region: "Americas", subregion: "South America", flag: "🇦🇷" },
  { code: "BS", name: "Bahamas", region: "Americas", subregion: "Caribbean", flag: "🇧🇸" },
  { code: "BB", name: "Barbados", region: "Americas", subregion: "Caribbean", flag: "🇧🇧" },
  { code: "BZ", name: "Belize", region: "Americas", subregion: "Central America", flag: "🇧🇿" },
  { code: "BO", name: "Bolivia", region: "Americas", subregion: "South America", flag: "🇧🇴" },
  { code: "BR", name: "Brazil", region: "Americas", subregion: "South America", featured: true, flag: "🇧🇷" },
  { code: "CA", name: "Canada", region: "Americas", subregion: "North America", flag: "🇨🇦" },
  { code: "CL", name: "Chile", region: "Americas", subregion: "South America", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", region: "Americas", subregion: "South America", flag: "🇨🇴" },
  { code: "CR", name: "Costa Rica", region: "Americas", subregion: "Central America", flag: "🇨🇷" },
  { code: "CU", name: "Cuba", region: "Americas", subregion: "Caribbean", flag: "🇨🇺" },
  { code: "DM", name: "Dominica", region: "Americas", subregion: "Caribbean", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", region: "Americas", subregion: "Caribbean", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", region: "Americas", subregion: "South America", flag: "🇪🇨" },
  { code: "SV", name: "El Salvador", region: "Americas", subregion: "Central America", flag: "🇸🇻" },
  { code: "GD", name: "Grenada", region: "Americas", subregion: "Caribbean", flag: "🇬🇩" },
  { code: "GT", name: "Guatemala", region: "Americas", subregion: "Central America", flag: "🇬🇹" },
  { code: "GY", name: "Guyana", region: "Americas", subregion: "South America", flag: "🇬🇾" },
  { code: "HT", name: "Haiti", region: "Americas", subregion: "Caribbean", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", region: "Americas", subregion: "Central America", flag: "🇭🇳" },
  { code: "JM", name: "Jamaica", region: "Americas", subregion: "Caribbean", flag: "🇯🇲" },
  { code: "MX", name: "Mexico", region: "Americas", subregion: "North America", featured: true, flag: "🇲🇽" },
  { code: "NI", name: "Nicaragua", region: "Americas", subregion: "Central America", flag: "🇳🇮" },
  { code: "PA", name: "Panama", region: "Americas", subregion: "Central America", flag: "🇵🇦" },
  { code: "PY", name: "Paraguay", region: "Americas", subregion: "South America", flag: "🇵🇾" },
  { code: "PE", name: "Peru", region: "Americas", subregion: "South America", flag: "🇵🇪" },
  { code: "KN", name: "Saint Kitts and Nevis", region: "Americas", subregion: "Caribbean", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucia", region: "Americas", subregion: "Caribbean", flag: "🇱🇨" },
  { code: "VC", name: "Saint Vincent and the Grenadines", region: "Americas", subregion: "Caribbean", flag: "🇻🇨" },
  { code: "SR", name: "Suriname", region: "Americas", subregion: "South America", flag: "🇸🇷" },
  { code: "TT", name: "Trinidad and Tobago", region: "Americas", subregion: "Caribbean", flag: "🇹🇹" },
  { code: "US", name: "United States", region: "Americas", subregion: "North America", featured: true, flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", region: "Americas", subregion: "South America", flag: "🇺🇾" },
  { code: "VE", name: "Venezuela", region: "Americas", subregion: "South America", flag: "🇻🇪" },

  // Asia (49 countries)
  { code: "AF", name: "Afghanistan", region: "Asia", subregion: "Southern Asia", flag: "🇦🇫" },
  { code: "AM", name: "Armenia", region: "Asia", subregion: "Western Asia", flag: "🇦🇲" },
  { code: "AZ", name: "Azerbaijan", region: "Asia", subregion: "Western Asia", flag: "🇦🇿" },
  { code: "BH", name: "Bahrain", region: "Asia", subregion: "Western Asia", flag: "🇧🇭" },
  { code: "BD", name: "Bangladesh", region: "Asia", subregion: "Southern Asia", featured: true, flag: "🇧🇩" },
  { code: "BT", name: "Bhutan", region: "Asia", subregion: "Southern Asia", flag: "🇧🇹" },
  { code: "BN", name: "Brunei", region: "Asia", subregion: "South-Eastern Asia", flag: "🇧🇳" },
  { code: "KH", name: "Cambodia", region: "Asia", subregion: "South-Eastern Asia", flag: "🇰🇭" },
  { code: "CN", name: "China", region: "Asia", subregion: "Eastern Asia", featured: true, flag: "🇨🇳" },
  { code: "CY", name: "Cyprus", region: "Asia", subregion: "Western Asia", flag: "🇨🇾" },
  { code: "GE", name: "Georgia", region: "Asia", subregion: "Western Asia", flag: "🇬🇪" },
  { code: "IN", name: "India", region: "Asia", subregion: "Southern Asia", featured: true, flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", region: "Asia", subregion: "South-Eastern Asia", featured: true, flag: "🇮🇩" },
  { code: "IR", name: "Iran", region: "Asia", subregion: "Southern Asia", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", region: "Asia", subregion: "Western Asia", flag: "🇮🇶" },
  { code: "IL", name: "Israel", region: "Asia", subregion: "Western Asia", flag: "🇮🇱" },
  { code: "JP", name: "Japan", region: "Asia", subregion: "Eastern Asia", featured: true, flag: "🇯🇵" },
  { code: "JO", name: "Jordan", region: "Asia", subregion: "Western Asia", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", region: "Asia", subregion: "Central Asia", flag: "🇰🇿" },
  { code: "KW", name: "Kuwait", region: "Asia", subregion: "Western Asia", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyzstan", region: "Asia", subregion: "Central Asia", flag: "🇰🇬" },
  { code: "LA", name: "Laos", region: "Asia", subregion: "South-Eastern Asia", flag: "🇱🇦" },
  { code: "LB", name: "Lebanon", region: "Asia", subregion: "Western Asia", flag: "🇱🇧" },
  { code: "MY", name: "Malaysia", region: "Asia", subregion: "South-Eastern Asia", featured: true, flag: "🇲🇾" },
  { code: "MV", name: "Maldives", region: "Asia", subregion: "Southern Asia", flag: "🇲🇻" },
  { code: "MN", name: "Mongolia", region: "Asia", subregion: "Eastern Asia", flag: "🇲🇳" },
  { code: "MM", name: "Myanmar", region: "Asia", subregion: "South-Eastern Asia", flag: "🇲🇲" },
  { code: "NP", name: "Nepal", region: "Asia", subregion: "Southern Asia", flag: "🇳🇵" },
  { code: "KP", name: "North Korea", region: "Asia", subregion: "Eastern Asia", flag: "🇰🇵" },
  { code: "OM", name: "Oman", region: "Asia", subregion: "Western Asia", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", region: "Asia", subregion: "Southern Asia", featured: true, flag: "🇵🇰" },
  { code: "PS", name: "Palestine", region: "Asia", subregion: "Western Asia", flag: "🇵🇸" },
  { code: "PH", name: "Philippines", region: "Asia", subregion: "South-Eastern Asia", featured: true, flag: "🇵🇭" },
  { code: "QA", name: "Qatar", region: "Asia", subregion: "Western Asia", flag: "🇶🇦" },
  { code: "SA", name: "Saudi Arabia", region: "Asia", subregion: "Western Asia", flag: "🇸🇦" },
  { code: "SG", name: "Singapore", region: "Asia", subregion: "South-Eastern Asia", flag: "🇸🇬" },
  { code: "KR", name: "South Korea", region: "Asia", subregion: "Eastern Asia", featured: true, flag: "🇰🇷" },
  { code: "LK", name: "Sri Lanka", region: "Asia", subregion: "Southern Asia", flag: "🇱🇰" },
  { code: "SY", name: "Syria", region: "Asia", subregion: "Western Asia", flag: "🇸🇾" },
  { code: "TW", name: "Taiwan", region: "Asia", subregion: "Eastern Asia", featured: true, flag: "🇹🇼" },
  { code: "TJ", name: "Tajikistan", region: "Asia", subregion: "Central Asia", flag: "🇹🇯" },
  { code: "TH", name: "Thailand", region: "Asia", subregion: "South-Eastern Asia", featured: true, flag: "🇹🇭" },
  { code: "TL", name: "Timor-Leste", region: "Asia", subregion: "South-Eastern Asia", flag: "🇹🇱" },
  { code: "TR", name: "Turkey", region: "Asia", subregion: "Western Asia", featured: true, flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", region: "Asia", subregion: "Central Asia", flag: "🇹🇲" },
  { code: "AE", name: "United Arab Emirates", region: "Asia", subregion: "Western Asia", featured: true, flag: "🇦🇪" },
  { code: "UZ", name: "Uzbekistan", region: "Asia", subregion: "Central Asia", flag: "🇺🇿" },
  { code: "VN", name: "Vietnam", region: "Asia", subregion: "South-Eastern Asia", featured: true, flag: "🇻🇳" },
  { code: "YE", name: "Yemen", region: "Asia", subregion: "Western Asia", flag: "🇾🇪" },

  // Europe (45 countries)
  { code: "AL", name: "Albania", region: "Europe", subregion: "Southern Europe", flag: "🇦🇱" },
  { code: "AD", name: "Andorra", region: "Europe", subregion: "Southern Europe", flag: "🇦🇩" },
  { code: "AT", name: "Austria", region: "Europe", subregion: "Western Europe", flag: "🇦🇹" },
  { code: "BY", name: "Belarus", region: "Europe", subregion: "Eastern Europe", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", region: "Europe", subregion: "Western Europe", flag: "🇧🇪" },
  { code: "BA", name: "Bosnia and Herzegovina", region: "Europe", subregion: "Southern Europe", flag: "🇧🇦" },
  { code: "BG", name: "Bulgaria", region: "Europe", subregion: "Eastern Europe", flag: "🇧🇬" },
  { code: "HR", name: "Croatia", region: "Europe", subregion: "Southern Europe", flag: "🇭🇷" },
  { code: "CZ", name: "Czech Republic", region: "Europe", subregion: "Eastern Europe", featured: true, flag: "🇨🇿" },
  { code: "DK", name: "Denmark", region: "Europe", subregion: "Northern Europe", flag: "🇩🇰" },
  { code: "EE", name: "Estonia", region: "Europe", subregion: "Northern Europe", flag: "🇪🇪" },
  { code: "FI", name: "Finland", region: "Europe", subregion: "Northern Europe", flag: "🇫🇮" },
  { code: "FR", name: "France", region: "Europe", subregion: "Western Europe", featured: true, flag: "🇫🇷" },
  { code: "DE", name: "Germany", region: "Europe", subregion: "Western Europe", featured: true, flag: "🇩🇪" },
  { code: "GR", name: "Greece", region: "Europe", subregion: "Southern Europe", flag: "🇬🇷" },
  { code: "HU", name: "Hungary", region: "Europe", subregion: "Eastern Europe", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", region: "Europe", subregion: "Northern Europe", flag: "🇮🇸" },
  { code: "IE", name: "Ireland", region: "Europe", subregion: "Northern Europe", flag: "🇮🇪" },
  { code: "IT", name: "Italy", region: "Europe", subregion: "Southern Europe", featured: true, flag: "🇮🇹" },
  { code: "XK", name: "Kosovo", region: "Europe", subregion: "Southern Europe", flag: "🇽🇰" },
  { code: "LV", name: "Latvia", region: "Europe", subregion: "Northern Europe", flag: "🇱🇻" },
  { code: "LI", name: "Liechtenstein", region: "Europe", subregion: "Western Europe", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", region: "Europe", subregion: "Northern Europe", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", region: "Europe", subregion: "Western Europe", flag: "🇱🇺" },
  { code: "MT", name: "Malta", region: "Europe", subregion: "Southern Europe", flag: "🇲🇹" },
  { code: "MD", name: "Moldova", region: "Europe", subregion: "Eastern Europe", flag: "🇲🇩" },
  { code: "MC", name: "Monaco", region: "Europe", subregion: "Western Europe", flag: "🇲🇨" },
  { code: "ME", name: "Montenegro", region: "Europe", subregion: "Southern Europe", flag: "🇲🇪" },
  { code: "NL", name: "Netherlands", region: "Europe", subregion: "Western Europe", featured: true, flag: "🇳🇱" },
  { code: "MK", name: "North Macedonia", region: "Europe", subregion: "Southern Europe", flag: "🇲🇰" },
  { code: "NO", name: "Norway", region: "Europe", subregion: "Northern Europe", flag: "🇳🇴" },
  { code: "PL", name: "Poland", region: "Europe", subregion: "Eastern Europe", featured: true, flag: "🇵🇱" },
  { code: "PT", name: "Portugal", region: "Europe", subregion: "Southern Europe", flag: "🇵🇹" },
  { code: "RO", name: "Romania", region: "Europe", subregion: "Eastern Europe", featured: true, flag: "🇷🇴" },
  { code: "RU", name: "Russia", region: "Europe", subregion: "Eastern Europe", flag: "🇷🇺" },
  { code: "SM", name: "San Marino", region: "Europe", subregion: "Southern Europe", flag: "🇸🇲" },
  { code: "RS", name: "Serbia", region: "Europe", subregion: "Southern Europe", flag: "🇷🇸" },
  { code: "SK", name: "Slovakia", region: "Europe", subregion: "Eastern Europe", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", region: "Europe", subregion: "Southern Europe", flag: "🇸🇮" },
  { code: "ES", name: "Spain", region: "Europe", subregion: "Southern Europe", featured: true, flag: "🇪🇸" },
  { code: "SE", name: "Sweden", region: "Europe", subregion: "Northern Europe", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", region: "Europe", subregion: "Western Europe", flag: "🇨🇭" },
  { code: "UA", name: "Ukraine", region: "Europe", subregion: "Eastern Europe", flag: "🇺🇦" },
  { code: "GB", name: "United Kingdom", region: "Europe", subregion: "Northern Europe", featured: true, flag: "🇬🇧" },
  { code: "VA", name: "Vatican City", region: "Europe", subregion: "Southern Europe", flag: "🇻🇦" },

  // Oceania (14 countries)
  { code: "AU", name: "Australia", region: "Oceania", subregion: "Australasia", featured: true, flag: "🇦🇺" },
  { code: "FJ", name: "Fiji", region: "Oceania", subregion: "Melanesia", flag: "🇫🇯" },
  { code: "KI", name: "Kiribati", region: "Oceania", subregion: "Micronesia", flag: "🇰🇮" },
  { code: "MH", name: "Marshall Islands", region: "Oceania", subregion: "Micronesia", flag: "🇲🇭" },
  { code: "FM", name: "Micronesia", region: "Oceania", subregion: "Micronesia", flag: "🇫🇲" },
  { code: "NR", name: "Nauru", region: "Oceania", subregion: "Micronesia", flag: "🇳🇷" },
  { code: "NZ", name: "New Zealand", region: "Oceania", subregion: "Australasia", flag: "🇳🇿" },
  { code: "PW", name: "Palau", region: "Oceania", subregion: "Micronesia", flag: "🇵🇼" },
  { code: "PG", name: "Papua New Guinea", region: "Oceania", subregion: "Melanesia", flag: "🇵🇬" },
  { code: "WS", name: "Samoa", region: "Oceania", subregion: "Polynesia", flag: "🇼🇸" },
  { code: "SB", name: "Solomon Islands", region: "Oceania", subregion: "Melanesia", flag: "🇸🇧" },
  { code: "TO", name: "Tonga", region: "Oceania", subregion: "Polynesia", flag: "🇹🇴" },
  { code: "TV", name: "Tuvalu", region: "Oceania", subregion: "Polynesia", flag: "🇹🇻" },
  { code: "VU", name: "Vanuatu", region: "Oceania", subregion: "Melanesia", flag: "🇻🇺" },
]

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code)
}

export function getCountryByName(name: string): Country | undefined {
  return countries.find(c => c.name.toLowerCase() === name.toLowerCase())
}

export function getCountriesByRegion(region: string): Country[] {
  return countries.filter(c => c.region === region)
}

export function getAllRegions(): string[] {
  return [...new Set(countries.map(c => c.region))]
}

export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase()
  return countries.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) || 
    c.code.toLowerCase().includes(lowerQuery)
  )
}

export function getFeaturedCountries(): Country[] {
  return countries.filter(c => c.featured)
}

// Popular manufacturing countries for quick selection
export const popularManufacturingCountries = [
  "CN", "IN", "VN", "TH", "ID", "MY", "BD", "PK", "TR", "MX", "BR", "PL", "CZ", "RO"
]

// Major export market regions
export const exportMarketRegions = [
  "North America",
  "Western Europe",
  "Eastern Europe",
  "Middle East",
  "Southeast Asia",
  "East Asia",
  "South Asia",
  "Africa",
  "South America",
  "Oceania",
  "Central America",
  "Caribbean"
]
