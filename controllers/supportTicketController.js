import SupportTicket from "../models/supportTicketModel.js";

// Create a new support ticket
export const createSupportTicket = async (req, res) => {
    try {
        const { user, email, userName, subject, description, priority, category } = req.body;
        const ticketID = "TICK-" + new Date().getTime(); // Generate a unique ticket ID

        const newTicket = new SupportTicket({ user, email, userName, subject, description, priority, category, ticketID });
        const savedTicket = await newTicket.save();

        res.status(201).json({ success: true, message: "Support ticket created successfully", data: savedTicket });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", data: error.message });
    }
};

// Get all support tickets for logged-in users only
export const getSupportTickets = async (req, res) => {
    try {
        const supportTickets = await SupportTicket.find({ user: req.user.id });
        res.status(200).json({ success: true, message: "Support tickets fetched successfully", data: supportTickets });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", data: error.message });
    }
};

// Get all support tickets for admin only
export const getAllSupportTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find().populate('user', 'name email');
        res.status(200).json({ success: true, message: "Support tickets fetched successfully", data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", data: error.message });
    }
};

// Get support ticket by ID
export const getSupportTicketById = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id).populate('user', 'name email');
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        res.status(200).json({ success: true, message: "Support ticket fetched successfully", data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", data: error.message });
    }
};

export const withdrawSupportTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await SupportTicket.findById(id);
    
        if (!ticket) {
          return res.status(404).json({ success: false, message: 'Ticket not found' });
        }
    
        if (ticket.user.toString() !== req.user.id) {
          return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
    
        ticket.status = 'Withdrawn'; 
        await ticket.save();
    
        res.status(200).json({ success: true, message: 'Ticket withdrawn successfully' });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
      }
    
}


// Chaging the status of the ticket to closed or open
export const changeTicketStatus = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        ticket.status = req.body.status;
        const updatedTicket = await ticket.save();

        res.status(200).json({ success: true, message: "Ticket status updated successfully", data: updatedTicket });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", data: error.message });
    }
}

// Add response to support ticket for admin only 
export const addResponse = async (req, res) => {
    try {
        const { response, respondedBy } = req.body;
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        ticket.responses.push({ response, respondedBy });
        const updatedTicket = await ticket.save();

        res.status(200).json({ success: true, message: "Response added successfully", data: updatedTicket });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", data: error.message });
    }
};



// Delete a support ticket
export const deleteSupportTicket = async (req, res) => {
    try {
        const deletedTicket = await SupportTicket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", data: error.message });
    }
};
