require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_EMAIL = 'cosaku10@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email configuration error:', error);
    console.log('Please check your EMAIL_USER and EMAIL_PASS in .env file');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});


function formatSDGNames(sdgArray) {
  const sdgMap = {
    'sdg1': 'SDG 1: No Poverty',
    'sdg2': 'SDG 2: Zero Hunger',
    'sdg3': 'SDG 3: Good Health and Well-being',
    'sdg4': 'SDG 4: Quality Education',
    'sdg5': 'SDG 5: Gender Equality',
    'sdg6': 'SDG 6: Clean Water and Sanitation',
    'sdg7': 'SDG 7: Affordable and Clean Energy',
    'sdg8': 'SDG 8: Decent Work and Economic Growth',
    'sdg9': 'SDG 9: Industry, Innovation and Infrastructure',
    'sdg10': 'SDG 10: Reduced Inequalities',
    'sdg11': 'SDG 11: Sustainable Cities and Communities',
    'sdg12': 'SDG 12: Responsible Consumption and Production',
    'sdg13': 'SDG 13: Climate Action',
    'sdg14': 'SDG 14: Life Below Water',
    'sdg15': 'SDG 15: Life on Land',
    'sdg16': 'SDG 16: Peace, Justice and Strong Institutions',
    'sdg17': 'SDG 17: Partnerships for the Goals'
  };
  
  if (!Array.isArray(sdgArray)) {
    return 'No SDGs selected';
  }
  
  return sdgArray.map(sdg => sdgMap[sdg] || sdg).join(', ');
}

function formatSDGsForHTML(sdgArray) {
  if (!Array.isArray(sdgArray) || sdgArray.length === 0) {
    return '<span style="color: #ff6b6b;">No SDGs selected</span>';
  }
  
  const formattedSDGs = formatSDGNames(sdgArray);
  const sdgList = sdgArray.map(sdg => {
    const sdgMap = {
      'sdg1': 'SDG 1: No Poverty',
      'sdg2': 'SDG 2: Zero Hunger',
      'sdg3': 'SDG 3: Good Health and Well-being',
      'sdg4': 'SDG 4: Quality Education',
      'sdg5': 'SDG 5: Gender Equality',
      'sdg6': 'SDG 6: Clean Water and Sanitation',
      'sdg7': 'SDG 7: Affordable and Clean Energy',
      'sdg8': 'SDG 8: Decent Work and Economic Growth',
      'sdg9': 'SDG 9: Industry, Innovation and Infrastructure',
      'sdg10': 'SDG 10: Reduced Inequalities',
      'sdg11': 'SDG 11: Sustainable Cities and Communities',
      'sdg12': 'SDG 12: Responsible Consumption and Production',
      'sdg13': 'SDG 13: Climate Action',
      'sdg14': 'SDG 14: Life Below Water',
      'sdg15': 'SDG 15: Life on Land',
      'sdg16': 'SDG 16: Peace, Justice and Strong Institutions',
      'sdg17': 'SDG 17: Partnerships for the Goals'
    };
    
    return `<span style="display: inline-block; background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 4px 10px; margin: 2px; border-radius: 15px; font-size: 12px; font-weight: 600;">${sdgMap[sdg] || sdg}</span>`;
  }).join(' ');
  
  return sdgList;
}

function buildAdminHtml({ teamName, projectIdea, problemStatement, proposedSolution, technologyUsed, sdgAlignment, projectCategory, memberEmails }) {
  const membersHtml = (memberEmails || []).map((m, i) => `
    <tr>
      <td style="padding:8px;border:1px solid #eee;">${i + 1}</td>
      <td style="padding:8px;border:1px solid #eee;">${escapeHtml(m)}</td>
    </tr>
  `).join('');

  const formattedSDGs = formatSDGsForHTML(sdgAlignment);

  return `
  <div style="font-family:Arial,sans-serif; color:#333; line-height:1.4;">
    <div style="max-width:700px;margin:0 auto;padding:20px;border-radius:8px;background:#f8fafc;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px;">🆕 New FOCLIS Hackathon Application</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Team "${escapeHtml(teamName || 'Unnamed Team')}" has applied!</p>
      </div>

      <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <h3 style="color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #eef6ff; padding-bottom: 8px;">📋 Team Details</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr>
            <td style="width:140px;font-weight:600;padding:8px;background:#f8f9fa;">Team Name</td>
            <td style="padding:8px;">${escapeHtml(teamName || '—')}</td>
          </tr>
          <tr>
            <td style="font-weight:600;padding:8px;background:#f8f9fa;">Project Category</td>
            <td style="padding:8px;">${escapeHtml(projectCategory || '—')}</td>
          </tr>
          <tr>
            <td style="font-weight:600;padding:8px;background:#f8f9fa;">Tech Stack</td>
            <td style="padding:8px;">${escapeHtml(technologyUsed || '—')}</td>
          </tr>
          <tr>
            <td style="font-weight:600;padding:8px;background:#f8f9fa;vertical-align:top;">SDG Alignment</td>
            <td style="padding:8px;">${formattedSDGs}</td>
          </tr>
        </table>
      </div>

      <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <h3 style="color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #eef6ff; padding-bottom: 8px;">💡 Project Details</h3>
        <div style="margin-bottom: 15px;">
          <h4 style="color: #333; margin-bottom: 5px;">Project Idea:</h4>
          <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 4px solid #667eea;">
            ${formatMultiline(projectIdea)}
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <h4 style="color: #333; margin-bottom: 5px;">Problem Statement:</h4>
          <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 4px solid #ff6b6b;">
            ${formatMultiline(problemStatement)}
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <h4 style="color: #333; margin-bottom: 5px;">Proposed Solution:</h4>
          <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 4px solid #4CAF50;">
            ${formatMultiline(proposedSolution)}
          </div>
        </div>
      </div>

      <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #eef6ff; padding-bottom: 8px;">👥 Team Members (${memberEmails.length})</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;padding:12px;border:1px solid #eee;background:#667eea;color:white;">#</th>
              <th style="text-align:left;padding:12px;border:1px solid #eee;background:#667eea;color:white;">Email</th>
            </tr>
          </thead>
          <tbody>
            ${membersHtml || `<tr><td colspan="2" style="padding:12px;border:1px solid #eee;text-align:center;color:#666;">No members provided</td></tr>`}
          </tbody>
        </table>
      </div>

      <div style="text-align: center; margin-top: 20px; padding: 15px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 8px;">
        <p style="color: white; margin: 0; font-size: 12px;">
          📅 Received: ${new Date().toLocaleString()} | 🏢 FOCLIS Hackathon Application Server
        </p>
      </div>
    </div>
  </div>
  `;
}

function buildTeamMemberHtml({ teamName, projectIdea, problemStatement, proposedSolution, technologyUsed, sdgAlignment, projectCategory, memberEmails }) {
  const formattedSDGs = formatSDGsForHTML(sdgAlignment);
  const sdgCount = Array.isArray(sdgAlignment) ? sdgAlignment.length : 0;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 28px;">🎉 FOCLIS Hackathon 2025</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Application Confirmation</p>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">✅ Your application has been received!</h2>
        
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #667eea; margin-bottom: 10px;">Team Details:</h3>
          <p><strong>Team Name:</strong> ${escapeHtml(teamName || '—')}</p>
          <p><strong>Project Category:</strong> ${escapeHtml(projectCategory || '—')}</p>
          <p><strong>Technology Stack:</strong> ${escapeHtml(technologyUsed || '—')}</p>
          <div style="margin-top: 10px;">
            <strong>SDG Alignment (${sdgCount} selected):</strong><br>
            <div style="margin-top: 8px;">${formattedSDGs}</div>
          </div>
        </div>
        
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #667eea; margin-bottom: 10px;">Project Overview:</h3>
          <div style="margin-bottom: 12px;">
            <strong>Project Idea:</strong><br>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-top: 5px; border-left: 4px solid #667eea;">
              ${formatMultiline(projectIdea)}
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <strong>Problem Statement:</strong><br>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-top: 5px; border-left: 4px solid #ff6b6b;">
              ${formatMultiline(problemStatement)}
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <strong>Proposed Solution:</strong><br>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-top: 5px; border-left: 4px solid #4CAF50;">
              ${formatMultiline(proposedSolution)}
            </div>
          </div>
        </div>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4CAF50;">
          <p style="color: #333; margin: 0; font-size: 16px; text-align: center;">
            Thank you for applying to be part of the FOCLIS Hackathon. We have received your application. Please go ahead and start building your MVP.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
        <p>Faculty of Computing, Library & Information Science</p>
        <p>© 2025 FOCLIS Hackathon. All rights reserved.</p>
        <p style="font-size: 12px; margin-top: 10px;">📅 Application received: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;
}

// small helpers
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatMultiline(text = '') {
  const esc = escapeHtml(text);
  return esc.split('\n').map(l => `<div style="margin-bottom:6px;">${l}</div>`).join('');
}

app.post('/apply', async (req, res) => {
  try {
    console.log('📧 Processing new application...');
    
    const payload = req.body || {};
    const {
      teamName, projectIdea, problemStatement, proposedSolution,
      technologyUsed, sdgAlignment, projectCategory, memberEmails = []
    } = payload;

    console.log(`👥 Team: ${teamName}`);
    console.log(`📧 Member emails: ${memberEmails.join(', ')}`);
    console.log(`🎯 SDGs selected: ${Array.isArray(sdgAlignment) ? sdgAlignment.join(', ') : 'None'}`);

    if (!teamName || !projectIdea || !problemStatement || !proposedSolution || 
        !technologyUsed || !projectCategory || !memberEmails) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (!Array.isArray(sdgAlignment) || sdgAlignment.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one Sustainable Development Goal must be selected'
      });
    }

    if (!Array.isArray(memberEmails) || memberEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one team member email is required'
      });
    }

    const adminHtml = buildAdminHtml({ 
      teamName, projectIdea, problemStatement, proposedSolution, 
      technologyUsed, sdgAlignment, projectCategory, memberEmails 
    });

    const formattedSDGsText = formatSDGNames(sdgAlignment);

    const adminMailOptions = {
      from: `"FOCLIS Hackathon" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🆕 New Hackathon Application — ${teamName || 'Unnamed Team'} (${sdgAlignment.length} SDGs)`,
      text: `
New FOCLIS Hackathon Application

Team: ${teamName || '—'}
Project Category: ${projectCategory || '—'}
SDGs Selected (${sdgAlignment.length}): ${formattedSDGsText}
Technology Stack: ${technologyUsed || '—'}

Project Idea: ${projectIdea || '—'}
Problem Statement: ${problemStatement || '—'}
Proposed Solution: ${proposedSolution || '—'}

Team Members (${memberEmails.length}): ${(memberEmails || []).join(', ') || '—'}

Received: ${new Date().toLocaleString()}
      `,
      html: adminHtml
    };

    console.log('📤 Sending admin notification...');
    await transporter.sendMail(adminMailOptions);
    console.log('✅ Admin notification sent to cosaku10@gmail.com');

    if (Array.isArray(memberEmails) && memberEmails.length > 0) {
      console.log(`📤 Sending confirmation emails to ${memberEmails.length} members...`);
      
      const teamMemberHtml = buildTeamMemberHtml({
        teamName, projectIdea, problemStatement, proposedSolution,
        technologyUsed, sdgAlignment, projectCategory, memberEmails
      });

      const thankYouText = `Thank you for applying to be part of the FOCLIS Hackathon. We have received your application. Please go ahead and start building your MVP.

Team: ${teamName}
SDGs Selected: ${formatSDGNames(sdgAlignment)}
Project Category: ${projectCategory}

— FOCLIS Hackathon Team
Faculty of Computing, Library & Information Science`;

      const sendPromises = memberEmails.map(email => transporter.sendMail({
        from: `"FOCLIS Hackathon 2025" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `🎉 FOCLIS Hackathon 2025 - Application Received for Team "${teamName}"`,
        text: thankYouText,
        html: teamMemberHtml
      }));

      await Promise.all(sendPromises);
      console.log('✅ Confirmation emails sent to all members');
    } else {
      console.log('⚠️ No member emails provided');
    }

    return res.json({ 
      success: true, 
      message: `Application received! Admin notified and confirmation emails sent to ${memberEmails.length} team members.`,
      teamName: teamName,
      memberCount: memberEmails.length,
      selectedSDGs: sdgAlignment,
      sdgCount: sdgAlignment.length
    });
    
  } catch (err) {
    console.error('❌ Error in /apply:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error sending emails. Please try again or contact support.' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FOCLIS Hackathon 2025 API is running with multi-SDG support',
    timestamp: new Date().toISOString(),
    features: {
      multiSDGSelection: true,
      emailNotifications: true,
      teamManagement: true
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FOCLIS Hackathon server running on port ${PORT}`);
  console.log(`📊 Multi-SDG selection support enabled`);
  console.log(`📧 Email notifications configured for admin: ${ADMIN_EMAIL}`);
  console.log(`🎯 Ready to process hackathon applications!`);
});