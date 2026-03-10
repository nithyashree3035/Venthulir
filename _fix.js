const fs = require('fs');
let c = fs.readFileSync('client/src/pages/AdminPage.jsx', 'utf8').split('\n');

const newLines = [
"                );",
"            case 'Users':",
"                return (",
"                    <div style={cardStyle}>",
"                        <table style={tableStyle}>",
"                            <thead>",
"                                <tr>",
"                                    <th style={thStyle}>Customer</th>",
"                                    <th style={thStyle}>Contact</th>",
"                                    <th style={thStyle}>Delivery Address</th>",
"                                    <th style={thStyle}>Joined</th>",
"                                </tr>",
"                            </thead>",
"                            <tbody>",
"                                {users.map(u => (",
"                                    <tr key={u._id} style={trStyle}>",
"                                        <td style={tdStyle}><strong>{u.name}</strong></td>",
"                                        <td style={tdStyle}>{u.email}<br /><small>{u.phone}</small></td>",
"                                        <td style={tdStyle}>",
"                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>",
"                                                {u.deliveryAddress?.address ? \\, \, \ \\ : 'Not Provided'}",
"                                            </span>",
"                                        </td>",
"                                        <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>",
"                                    </tr>",
"                                ))}",
"                            </tbody>",
"                        </table>",
"                    </div>"
];

let startIdx = 427;
let endIdx = startIdx;
for(let i = startIdx; i < c.length; i++) {
   if(c[i].includes("case 'Inventory':")) {
      endIdx = i;
      break;
   }
}

c.splice(startIdx, endIdx - startIdx, ...newLines);
fs.writeFileSync('client/src/pages/AdminPage.jsx', c.join('\n'));
console.log("Successfully Patched AdminPage.jsx");
